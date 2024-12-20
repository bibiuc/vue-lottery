const express = require("express");
const opn = require("opn");
const bodyParser = require("body-parser");
const cfg = require("./config");
const database = require("./database")

const {
  writeXML
} = require("./help");

let app = express(),
  router = express.Router(),
  cwd = process.cwd(),
  port = 8090,
  defaultPage = `default data`;

//这里指定参数使用 json 格式
app.use(
  bodyParser.json({
    limit: "1mb"
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

if (process.argv.length > 2) {
  port = process.argv[2];
}

app.use(express.static(cwd));

//请求地址为空，默认重定向到index.html文件
app.get("/", (req, res) => {
  res.redirect(301, "index.html");
});

//设置跨域访问
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.post("*", (req, res, next) => {
  log(`请求内容：${JSON.stringify(req.path, 2)}`);
  next();
});

// 获取之前设置的数据
router.post("/getTempData", async (req, res, next) => {
  const leftUsers = await database.getLeftUsers();
  const luckyUsers = await database.getLuckyUsers();
  if (luckyUsers && luckyUsers.length) {
    luckyData = luckyUsers.reduce((res, item, index) => {
      res[item.prize_id] = res[item.prize_id] ? res[item.prize_id].concat([item]) : [item]
      return res;
    }, {})
  } else {
    luckyData = {};
  }
  res.json({
    cfgData: cfg,
    leftUsers: leftUsers,
    luckyData: luckyData
  });
});

// 获取所有用户
router.post("/reset", async (req, res, next) => {
  const users = await database.getAllUsers();
  const user_ids = users.map(({id}) => id);
  await database.saveLuckyUsers(user_ids, 0);
  log(`重置数据成功`);
  res.json({
    type: "success"
  });
});

// 获取所有用户
router.post("/getUsers", async (req, res, next) => {
  const users = await database.getLeftUsers();
  res.json(users);
  log(`成功返回抽奖用户数据`);
});

// 保存抽奖数据
router.post("/saveData", async (req, res, next) => {
  try {
    let data = req.body;
    const user_ids = data.data.map(({id}) => id)
    const result = await database.saveLuckyUsers(user_ids, data.type)
    log(result)
    res.json({
      type: "设置成功！"
    });
    log(`保存奖品数据成功`);
  } catch (e) {
    log(e.stack)
    res.json({
      type: "设置失败！"
    });
    log(`保存奖品数据失败`);
  }
});

// 保存数据到excel中去
router.post("/export", async (req, res, next) => {
  let outData = [["奖项", "昵称", "手机号"]];
  const luckyUsers = await database.getLuckyUsers();
  cfg.prizes.forEach(item => {
    outData.push([item.text]);
    outData = outData.concat(luckyUsers.filter((user) => user.prize_id == item.type).map((user) => [item.text, user.nickname, user.mobile]) || []);
  });

  writeXML(outData, "/抽奖结果.xlsx")
    .then(dt => {
      // res.download('/抽奖结果.xlsx');
      res.status(200).json({
        type: "success",
        url: "抽奖结果.xlsx"
      });
      log(`导出数据成功！`);
    })
    .catch(err => {
      res.json({
        type: "error",
        error: err.error
      });
      log(`导出数据失败！`);
    });
});

//对于匹配不到的路径或者请求，返回默认页面
//区分不同的请求返回不同的页面内容
router.all("*", (req, res) => {
  if (req.method.toLowerCase() === "get") {
    if (/\.(html|htm)/.test(req.originalUrl)) {
      res.set("Content-Type", "text/html");
      res.send(defaultPage);
    } else {
      res.status(404).end();
    }
  } else if (req.method.toLowerCase() === "post") {
    let postBackData = {
      error: "empty"
    };
    res.send(JSON.stringify(postBackData));
  }
});

app.use(router);

function log(text) {
  global.console.log(text);
  global.console.log("-----------------------------------------------");
}

module.exports = {
  run: function (devPort, noOpen) {
    let openBrowser = true;
    if (process.argv.length > 3) {
      if (process.argv[3] && (process.argv[3] + "").toLowerCase() === "n") {
        openBrowser = false;
      }
    }

    if (noOpen) {
      openBrowser = noOpen !== "n";
    }

    if (devPort) {
      port = devPort;
    }

    let server = app.listen(port, () => {
      let host = server.address().address;
      let port = server.address().port;
      global.console.log(`lottery server listenig at http://${host}:${port}`);
      openBrowser && opn(`http://127.0.0.1:${port}`);
    });
  }
};
