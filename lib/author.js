var db = require('../nodejs/mysql.js');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');

exports.home = (req, res) => {
    db.query(`select * from topic`, (err, topics) => {
        if (err) throw err;
        db.query(`select * from author`, (err2, authors) => {
            if (err2) throw err2;
            var title = 'Welcome';
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `
                ${template.authorTable(authors)}
                <style>
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border: 1px solid black;
                    }
                </style>
                <form action="/author/create_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="name">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="profile"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
                ``
            );
            res.writeHead(200);
            res.end(html);
        })
    })
}

exports.create_process = (req, res) => {
    var body = '';
    req.on('data', function (data) {
        body = body + data;
    });
    req.on('end', function () {
        var post = qs.parse(body);
        db.query(
            `insert into author (name, profile) 
          values(?, ?)`, [post.name, post.profile], (err) => {
            if (err) throw err;
            res.writeHead(302, { Location: `/author` });
            res.end();
        })
    });
}

exports.update = (req, res) => {
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    db.query(`select * from topic`, (err, topics) => {
        if (err) throw err;
        db.query(`select * from author`, (err2, authors) => {
            if (err2) throw err2;
            var title = 'Welcome';
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `
                ${template.authorTable(authors)}
                <style>
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border: 1px solid black;
                    }
                    table > tr > td > a{
                        border: 1px solid black;
                        border-radius: 10px;
                    }
                </style>
                <form action="/author/update_process" method="post">
                    <input type="hidden" name="id" value="${queryData.id}">
                    <p>
                        <input type="text" name="name" placeholder="name" value="${authors[queryData.id - 1].name}">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="profile">${authors[queryData.id - 1].profile}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
                ``
            );
            res.writeHead(200);
            res.end(html);
        })
    })
}

exports.update_process = (req, res) => {
    var body = '';
    req.on('data', function (data) {
        body = body + data;
    });
    req.on('end', function () {
        var post = qs.parse(body);
        db.query(
            `update author set name=?, profile=? where id=?`,
            [post.name, post.profile, post.id], (err) => {
                if (err) throw err;
                res.writeHead(302, { Location: `/author` });
                res.end();
            })
    });
}

exports.delete_process = (req, res) => {
    var body = '';
    req.on('data', function (data) {
        body = body + data;
    });
    req.on('end', function () {
        var post = qs.parse(body);
        db.query('delete from topic where author_id=?', [post.id], (err) => {
            if (err) throw err;
            db.query('delete from author where id=?', [post.id], (err2) => {
                if (err2) throw err;
                res.writeHead(302, { Location: `/author` });
                res.end();
            })
        })
    });
}