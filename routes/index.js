

var express = require('express');
var router = express.Router();
var markdown = require('markdown-js'); 
var fs = require('fs');
var mongoose = require('./connect.js')

var textSchema = new mongoose.Schema({
    "name":String,
    "con":String,  
    "author": String,
    "kind": String,
    "optime": String
})

// 发布模型
var txtModel= mongoose.model('con',textSchema,'con');

router.get('/markdown', function(req, res) {  
    res.render('index.md',{layout:true});
 })

router.get('/mark.html',function(req,res){
    var html1 = markdown.makeHtml("[Java Eye](http://www.iteye.com/ \"Click\") ");  
    res.send(html1)  
    
  })


// 查询数据
router.get('/mktxt.html',function(req,res){
    console.log("111")
    txtModel.find({"name":"333"}).exec(function(err,data){
        console.log(data)
        var html = markdown.makeHtml(data[0].con);  
        res.send(html)  
    })
// 存储数据
})

router.post('/con_save.html',function(req,res){
    var name = req.body.name;
    var con = req.body.con;
    var author = req.body.author;
    var kind = req.body.kind;
    var optime = req.body.optime;
    // console.log(name,con,author,kind,optime)
    //定义一个实例
    var conmodel  = new txtModel();

    conmodel.name = name;
    conmodel.con = con;
    conmodel.author = author;
    conmodel.kind = kind;
    conmodel.optime = optime;

    conmodel.save(function(err){
        if(err){
            res.send('0')
        }else{
            res.send("1")
        }
    })

})


// 渲染数据
router.get('/addlist.html',function(req,res){
    txtModel.find({}).sort({"optime":1}).exec(function(err,data){
        res.send(data);
    })
})
// post页面渲染

router.get('/cons.html',function(req,res){
    var id = req.query.id;
    console.log(id);
    txtModel.findById(id,function(err,data){
        console.log(data.con)
        var datas = {};
        var html = markdown.makeHtml(data.con);
        datas.html = html;
        datas.name = data.name;
        datas.optime = data.optime;
        datas.kind = data.kind;
        res.send(datas);
    })
})

// 删除

router.get('/article_delete.html',function(req,res){
    var id = req.query.id;
    txtModel.findById(id,function(err,data){
        data.remove(function(err){
            // console.log("111")
            res.redirect('/admin/moorain.html')
            res.end()
        });
    })
})


//回填_修改

router.get('/artile_edit.html',function(req,res){
    var id = req.query.id;
    txtModel.findById(id,function(err,data){
       res.send(data);
    })
})

// 保存修改
// con_edit_save
router.post('/con_edit_save.html',function(req,res){
    var name = req.body.name;
    var con = req.body.con;
    var author = req.body.author;
    var kind = req.body.kind;
    var optime = req.body.optime;
    // console.log(name,con,author,kind,optime)
    var id = req.body.id;
    // console.log(id);
    txtModel.findById(id,function(erre,data){
        data.name = name;
        data.con = con;
        data.author = author;
        data.kind = kind;
        data.optime = optime;
        data.save(function(err){
            res.redirect('./admin/moorain.html')
        })
    })
})

// 主页分类 kind
router.get('/kind_list.html',function(req,res){
    var kind = req.query.kind;
    txtModel.find({"kind":kind}).exec(function(err,data){
        res.send(data);
    })
})


// 文章页：

// 相关推荐

router.get('/recommend.html',function(req,res){
    var id = req.query.id;
    txtModel.findById(id,function(err,data){
       var kind = data.kind;
       txtModel.find({"kind":kind}).exec(function(err,data){
           res.send(data);
       })
    })
})

// 评论保存
var msgSchema = new mongoose.Schema({
    "name":String,
    "con":String,  
    "date":String,  
    "floor":String, 
    "txtid":String // 该评论所对应的id
})

// 发布模型
var msgModel= mongoose.model('msg',msgSchema,'msg');

// 获取保存评论的请求
router.post('/comment_save.html',function(req,res){
    var txtid = req.body.txt_id;
    var name = req.body.name;
    var con = req.body.con;
    var date = req.body.date;
    console.log(name,con,date,txtid)
    msgModel.find({"txtid":txtid}).exec(function(err,data){
       thisfloor = data.length+1;
       console.log(thisfloor);
       var msg = new msgModel();
       msg.name = name;
       msg.con = con;
       msg.date = date;
       msg.txtid = txtid;
       msg.floor = thisfloor;
       msg.save(function(err){
           if(err){
               throw err;
           }else{
                res.send("1");
           }
       })
    })
})
// 显示评论的请求
router.get('/show_msg.html',function(req,res){
    var txtid = req.query.id;
    // console.log("当前id",txtid);
    msgModel.find({"txtid":txtid}).exec(function(err,data){
        // console.log(data);
        res.send(data);
    })
})
// 后台管理评论
router.get('/admin_show_msg.html',function(req,res){
    msgModel.find({}).exec(function(err,data){
        res.send(data);
    })
})
// 后台管理评论删除
router.get('/delete_msg.html',function(req,res){
    var id = req.query.id;
    msgModel.findById(id,function(err,data){
        data.remove(function(err){
            console.log("delete msg is success....")
            res.redirect('/admin/msg.html')
        })
    })
})

module.exports = router;