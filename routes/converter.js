const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');
const path = require('path');
const AWS = require('aws-sdk');
const util = require('util');
const ICO = require('icojs');
const toPdf = require("../parseDoc");
const parseFirstPage = require("../parseFirstPage");
const gm = require('gm').subClass({
    imageMagick: true,
});

// get reference to S3 client
let s3 = new AWS.S3();


router.post('/requestUploadURL', function (req, res) {
    // Parse out the parameters of the file the client would like to upload.
    var params = req.body;

    // Assemble a dictionary of parameters to hand to S3: the S3 bucket name, the file name, the file type, and permissions.  Other paramters like expiration can be specified here.  See the documentation for this method for more details.
    var s3Params = {
        Bucket: 'img-con-bkt',
        Key: params.name,
        ContentType: params.type,
        ACL: 'public-read',
    };
    // Ask S3 for a temporary URL that the client can use.
    var uploadURL = s3.getSignedUrl('putObject', s3Params);

    res.send({ status: 'success', uploadURL: uploadURL });
});
router.post('/', function (req, res) {

    const key = req.body.name;

    let ext = key.split('.')[key.split('.').length - 1];

    if (!ext) {
        console.error('unable to infer image type for key ' + key);
        return;
    }

    const fileName = path.basename(key);
    const baseName = fileName.replace("." + ext, "");

    const a = baseName.split("--");

    if (a.length < 2) {
        console.log('Error, Target name not found in name');
        return;
    }

    const targetType = a[1];

    let newKey = key.replace("--" + targetType, "")
        .replace("." + ext, "." + targetType)
        .replace("original", "converted");

    console.log("Convert: " + ext + " to " + targetType);

    s3.getObject({
        Bucket: BUCKET,
        Key: key
    }, (err, response) => {

        if (ext == 'doc' || ext == 'docx') {
            toPdf(response.Body).then(
                (pdfBuffer) => {
                    if (targetType == 'pdf') {

                        s3.putObject({
                            Bucket: BUCKET,
                            Key: newKey,
                            Body: pdfBuffer,
                            ContentType: targetType
                        }, (err, result) => {
                            let status = 'success', error = '';
                            if (err) {
                                status = 'error';
                                error = err;
                            }

                            // console.timeEnd("uploadImage");
                            res.send({ status: status, err: error, url: newKey });
                        });
                    } else {
                        parseFirstPageOfBuffer(pdfBuffer, 'pdf', targetType, newKey, res);
                    }
                }, (err) => {
                    console.log(err)
                }
            )
        } else if (ext == 'ico' && targetType == 'png') {
            // res.send({ status: 'error'});
            ICO.parse(response.Body, 'image/png').then(images => {
                let imagesByWidths = {}, maxWidth = 0;
                images.forEach(image => {
                    imagesByWidths[image.width] = image;
                    if (image.width > maxWidth) maxWidth = image.width;
                });

                if (maxWidth > 0) {
                    const image = imagesByWidths[maxWidth];
                    const data = Buffer.from(image.buffer);
                    console.log('converting ico file');

                    s3.putObject({
                        Bucket: BUCKET,
                        Key: newKey,
                        Body: data,
                        ContentType: targetType
                    }, (err, result) => {
                        let status = 'success', error = '';
                        if (err) {
                            status = 'error';
                            error = err;
                        }

                        // console.timeEnd("uploadImage");
                        res.send({ status: status, err: error, url: newKey });
                    });
                } else {
                    res.send({ status: 'error', error: {} });
                }
            });
        } else if (ext == 'pdf' || ext == 'gif') {
            parseFirstPageOfBuffer(response.Body, ext, targetType, newKey, res);
        } else {
            let GM;
            GM = gm(response.Body);
            GM.toBuffer(targetType, function (err, buffer) {

                if (err) {
                    // console.log('Got Error');
                    // console.log(err);
                    res.send({ status: 'error', error: err });
                } else {
                    // console.timeEnd("convertImage");
                    // console.time("uploadImage");

                    s3.putObject({
                        Bucket: BUCKET,
                        Key: newKey,
                        Body: buffer,
                        ContentType: targetType
                    }, (err, result) => {
                        let status = 'success', error = '';
                        if (err) {
                            status = 'error';
                            error = err;
                        }

                        // console.timeEnd("uploadImage");
                        res.send({ status: status, err: error, url: newKey });
                    });
                }
            });
        }
        // console.time("convertImage");
        // console.log("Reponse content type : " + response.ContentType);
    });
});

let parseFirstPageOfBuffer = (body, type, targetType, newKey, res) => {

    parseFirstPage(body, type, targetType).then(buffer => {
        console.log('got buffer from pdf');
        let GM = gm(buffer);
        // GM.flatten().background('white');
        GM.toBuffer(targetType, function (err, buffer) {

            console.log('got buffer from gm');
            if (err) {
                // console.log('Got Error');
                // console.log(err);
                res.send({ status: 'error', error: err });
            } else {
                // console.timeEnd("convertImage");
                console.time("uploadImage");

                s3.putObject({
                    Bucket: BUCKET,
                    Key: newKey,
                    Body: buffer,
                    ContentType: targetType
                }, (err, result) => {
                    let status = 'success', error = '';
                    if (err) {
                        status = 'error';
                        error = err;
                    }

                    console.timeEnd("uploadImage");
                    res.send({ status: status, err: error, url: newKey });
                });
            }
        });
    }, err => {
        console.log(err);
    });
}
module.exports = router;