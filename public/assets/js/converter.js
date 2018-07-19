
$.fileHolder = $('.owl-carousel');
function truncate(n, len) {
    var ext = n.substring(n.lastIndexOf(".") + 1, n.length).toLowerCase();
    var filename = n.replace('.' + ext, '');
    if (filename.length <= len) {
        return n;
    }
    filename = filename.substr(0, len) + (n.length > len ? '..' : '');
    return filename + '.' + ext;
};
function Converter() {

    this.fileList = {};
    this.fileIds = [];

    this.queue = [];
    this.inProgress = 0;
    this.invalidFiles = [];
    this._globalService = {
        STATUS_WAITING: 1,
        STATUS_UPLOADING: 2,
        STATUS_CONVERTING: 3,
        STATUS_DONE: 4,
        STATUS_ERROR: 5,
        apiHost: 'https://xgnyf6561m.execute-api.us-east-2.amazonaws.com/dev/',
        s3bucket: 'http://img-con-bkt.s3-website.us-east-2.amazonaws.com/',
        // apiHostEc2: 'http://localhost:9000/',
        apiHostEc2: 'http://ec2-18-216-103-250.us-east-2.compute.amazonaws.com:9000/',
        statusText: {
            1: 'Waiting',
            2: 'Uploading',
            3: 'Converting',
            4: 'Done',
            5: 'Error',
        }
    }



    this.enabledDownloadAll = function (val) {
        if (val) {
            $("#downloadAllEnabled").attr('disabled', false);
        } else {
            $("#downloadAllEnabled").attr('disabled', 'disabled');
        }
    };

    this.showModal = function () {
        $("#invalid-pop-up").fadeIn();
    }

    this.checkExtension = function (allowed, ext) {
        console.log(allowed, ext);
        ext = ext.toLowerCase();
        var convert = {
            'iiq': 'raw',
            'tif': 'tiff',
            'docx': 'doc',
            'jpeg': 'jpg'
        }
        if (convert[ext]) {
            ext = convert[ext];
        }
        return allowed.lastIndexOf(ext) != -1;
    }

    this.addFile = function (allowed, target, file, status, url) {
        var name = file.name;
        console.log(file)
        var ext = name.split('.')[file.name.split('.').length - 1];
        var baseName = name.replace("." + ext, "");
        if (this.checkExtension(allowed, ext)) {
            var newFile = {
                id: this.uuidv4(),
                file: file,
                name: name,
                baseName: baseName,
                type: ext,
                target: target,
                url: url,
                total: file.size,
                done: 0,
                added: Date.now(),
                status: status
            };
            Object.defineProperty(newFile.file, 'name', {
                writable: true,
                value: newFile.id + "/" + baseName + "--" + target + "." + ext
            });
            this.fileList[newFile.id] = newFile;
            this.refreshFiles();
            this.queue.push(newFile);
            this.insertIntoDom(newFile);
            this.processQueue();
            localStorage.setItem('files', JSON.stringify(this.fileList));
        } else {
            this.showModal();
            // show error
        }
    }

    this.insertIntoDom = function (file) {
        const percent = 3;
        const html = `<div class="single-convert-download-card" id="${file.id}">
        <h3>${truncate(file.name, 20)}</h3>
        <div class="progress">
              <div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="width: 25%">
              </div>
        </div>
        <h4><span class="status">${this._globalService.statusText[file.status]}</span> <span class="status">${percent}</span>%</h4>
        <button type="button" class="download-btn">Download ${file.target.toUpperCase()}</button>
        <a href="javascript:removeItem('${file.id}')" class="download-cross">
            <i class="fa fa-close"></i>
        </a>
    </div>`;

        owl.trigger('add.owl.carousel', [$(html)]);
        owl.trigger('refresh.owl.carousel');

    };
    this.refreshFiles = function () {
        var notDone = false;

        for (var f in this.fileList) {
            if (this.fileList[f].status < 4) {
                notDone = true;
            }
        }
        this.enabledDownloadAll(notDone);
        console.log(this.fileList);
        if (Object.keys(this.fileList).length) {
            $(".converter-download-btn-group").show();
        } else {
            $(".converter-download-btn-group").hide();
        }
    }
    this.reloadFiles = function () {
        if (localStorage.getItem('files')) {
            this.fileList = JSON.parse(localStorage.getItem('files'));
            this.refreshFiles();
        }

        for (var f in this.fileList) {
            this.insertIntoDom(this.fileList[f]);
        }
    }

    this.deleteFile = function (id) {
        $("#" + id).remove();
        delete this.fileList[id];
        this.refreshFiles();

        localStorage.setItem('files', JSON.stringify(this.fileList));
        return;
    }
    this.processQueue = function () {
        if (this.inProgress < 3) {
            this.sendFiles();
        }
    }
    this.sendFiles = function () {
        if (!this.queue.length) {
            return;
        }
        this.inProgress++;
        var file = this.queue.shift();

        if (file.file instanceof File) {
            file.status = this._globalService.STATUS_UPLOADING;
            this.refreshFiles();
        } else {
            file.status = this._globalService.STATUS_ERROR;
            this.refreshFiles();
            return;
        }

        Object.defineProperty(file.file, 'name', {
            writable: true,
            value: 'original/' + file.file.name
        });
        var $this = this;
        console.log('lkj')
        $.ajax({
            method: "POST",
            url: this._globalService.apiHostEc2 + 'convert/requestUploadURL',
            data: { name: file.file.name, type: file.file.type },
            dataType: 'json',
            success: function (data) {
                $.ajax({
                    xhr: function() {
                        var xhr = new window.XMLHttpRequest();
                        xhr.upload.addEventListener("progress", function(evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = evt.loaded / evt.total;
                                //Do something with upload progress here
                            }
                       }, false);
                
                       xhr.addEventListener("progress", function(evt) {
                           if (evt.lengthComputable) {
                               var percentComplete = evt.loaded / evt.total;
                               //Do something with download progress
                           }
                       }, false);
                
                       return xhr;
                    },
                    type: 'PUT',
                    url: data.uploadURL,
                    contentType: file.file.type,
                    processData: false,
                    data: file.file,
                    success: function(data){
                        alert('File uploaded');
                    }
                });
                // $.ajax({
                //     type: 'PUT',
                //     url: data.uploadURL,
                //     // Content type must match with the parameter you signed your URL with
                //     // contentType: file.file.type,
                //     // this flag is important, if not set, it will try to send data as a form
                //     // processData: false,
                //     // the actual file is sent raw
                //     data: file.file
                //   })
                //   .success(function() {
                //     alert('File uploaded');
                //   })
                //   .error(function() {
                //     alert('File NOT uploaded');
                //     console.log( arguments);
                //   });
                // var req = new HttpRequest('PUT', data["uploadURL"], file.file, {
                //     reportProgress: true
                // });

                // $this._http.request(req).subscribe(e => {
                //     if (e.type === HttpEventType.UploadProgress) {
                //         file.parcentDone = Math.round(100 * e.loaded / e.total);
                //         file.done = e.loaded;
                //         file.total = e.total;
                //     } else if (e instanceof HttpResponse) {

                //         file.status = $this._globalService.STATUS_CONVERTING;

                //         file.url = 'converted/' + file.id + '/' + file.baseName + '.' + file.target;
                //         $this.saveFiles();

                //         setTimeout(() => {
                //             $this.inProgress--;
                //             $this.processQueue();
                //         }, 200);

                //         $this.checkFileStatus(file);
                //     }
                // })
            }
        });
        // this._http.post(this._globalService.apiHost + 'requestUploadURL', JSON.stringify(), {
        //     headers
        // }).subscribe(data => {
        // });
    }

    this.checkFileStatus = function (file) {
        var $this = this;

        var headers = new HttpHeaders().set('Content-Type', 'application/json; charset=UTF-8');

        if (
            file.type == 'gif' ||
            file.type == 'pdf' ||
            file.type == 'doc' ||
            file.type == 'docx' ||
            file.type == 'webp' ||
            file.type == 'svg' ||
            file.type == 'ico'
        ) {
            // this._http.post(this._globalService.apiHostEc2, JSON.stringify({ name: file.file.name }), {
            //     headers
            // }).subscribe(data => {
            //     console.log(data);
            //     if (data['status'] == 'success') {
            //         file.status = this._globalService.STATUS_DONE;
            //     } else {
            //         file.status = this._globalService.STATUS_ERROR;
            //     }
            //     $this.saveFiles();
            // });

        } else {
            // this._http.post(this._globalService.apiHost + 'process', JSON.stringify({ name: file.file.name }), {
            //     headers
            // }).subscribe(data => {
            //     console.log(data);
            //     if (data['status'] == 'success') {
            //         file.status = this._globalService.STATUS_DONE;
            //     } else {
            //         file.status = this._globalService.STATUS_ERROR;
            //     }
            //     $this.saveFiles();
            // });    
        }
    }
    this.checkFileTime = function (file, uploaded) {
        var timeOut = 1000 * 10;

        if (Date.now() - uploaded > timeOut) {
            file.status = this._globalService.STATUS_ERROR;
            this.saveFiles();
            console.log('file not found!');
            return false;
        }
        return true;
    }

    this.handleError = function (error) {

        var errorMessage = {};
        // Connection error
        if (error.status === 0) {
            errorMessage = {
                success: false,
                status: 0,
                data: 'Sorry, there was a connection error occurred. Please try again.',
            };
        } else {
            errorMessage = error.json();
        }
        return Observable.throw(errorMessage);
    }

    this.uuidv4 = function () {
        return 'xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}