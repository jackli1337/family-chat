// javascript

/* ---------- AJAX calls (Long-Polling) ---------- */
// window.onload = setInterval(getFeed(), 1000);

/* ---------- Websocket (wss) ---------- */
window.onload = function viaWebSocket() {
    let sock = io.connect(`${window.location.host}`);

    // ===== Submit a Post ===== //
    // event listener waiting for action on "post" button
    this.document.getElementById(`spost`).onclick = () => {
        // grabbing values from the form
        let
            fp_title = this.document.getElementById(`fp-title`),
            fp_content = this.document.getElementById(`fp-content`),
            fp_file = this.document.getElementById(`fp-file`);

        // sends data via websocket (sent as an object)
        sock.emit(`spost`, {
            title: fp_title.value,
            content: fp_content.value,
            file: fp_file.value
        });

        // resets the values in the form
        fp_title.value = ``;
        fp_content.value = ``;
        fp_file.value = ``;
    };

    // ===== Submit a Comment ===== //
    this.updateCommentListeners(`class`, sock);

    /* ===== FEEL FREE TO MODIFY LINES 40 - 68 ===== */
    // // ===== Submit an Upvote ===== //
    // this.document.getElementById(`supvote`).onclick = () => {
    //     sock.emit(`supvote`, {

    //     });
    //     input.value = ``;
    // };

    // // ===== Submit a Downvote ===== //
    // this.document.getElementById(`sdownvote`).onclick = () => {
    //     sock.emit(`sdownvote`, {

    //     });
    //     input.value = ``;
    // };

    // // ===== Send a Direct Message ===== //
    // this.document.getElementById(`smessage`).onclick = () => {
    //     let input = this.document.getElementById(`form-message`);
    //     sock.emit(`smessage`, {

    //     });
    //     input.value = ``;
    // };

    // sock.onmessage = function (event) {
    //     renderMessage(event.data, `Others - 00:00 AM`);
    // };

    // ===== Listener ===== //
    sock.on(`spost`, (data) => {
        renderPost(data);
        this.updateCommentListeners(`id`, sock, data._id);
    });
    sock.on(`scomment`, (data) => {
        renderComment(data);
    });
    sock.on(`svote`, (data) => {
        renderVote(data);
    });
};


/* ---------- Front-End Features ---------- */

// ===== Render Post ===== //
function renderPost(data) {
    // injects template with non-user generated content
    // *** need to create a function that checks for valid file name (done in App.js?)
    console.info(data);
    let newDate = getDate(data.date);
    let inject = `
        <div class="post" id="${data._id.toString()}">
            <div class="content-section">
                <h1 id="postTitle${data._id.toString()}">${data.content.title}</h1>
                <div class="post-author">
                    <div class="post-pfp">
                        <img src="/img/Profile%20Picture.png"/>
                    </div>

                    <div class="post-creation">
                        <a class="post-name"> ${data.fullname}</a>
                        <a class="post-date">${newDate}</a>
                    </div>
                </div>

                <div class="post-body">
                    <p id="postContent${data._id.toString()}">${data.content.post}</p>
                    ${renderImage(data.filepath)}
                </div>

                <div class="post-tools">
                    <button id="upvotes${data._id.toString()}" onclick="vote('up','${data._id.toString()}')"><i class="far fa-thumbs-up"></i>${data.Upvotes}</button>
                    <button id="downvotes${data._id.toString()}" onclick="vote('down','${data._id.toString()}')"><i class="far fa-thumbs-down"></i>${data.Downvotes}</button>   
                    <!-- If post is an image, render button -->
                    <button onclick="saveImage()"><i class="fas fa-file-download"></i></button>
                    <button><i class="fas fa-share"></i></button>
                </div>
            </div>
            <div class="comment-section">
                <div class="comment-history" id="comment-history${data._id.toString()}">
                    <!-- insert comments here -->
                </div>
                <div class="post-comments">
                    <textarea id="pc-comment${data._id.toString()}" class="comment" wrap="hard"
                        placeholder="Add a comment..."></textarea>
                    <input class="scomment" id="c${data._id.toString()}" type="submit" value="comment" />
                </div>
            </div>
        </div>
    `;

    // update website with BLANK template
    let feed = document.getElementById(`feedView`);
    feed.innerHTML += inject;
}

// ===== Render Image ===== //
function renderImage(data) {
    let string = `<img src="${data}"/>`
    if (!data.includes(`.JPG`)) { return ``; }
    return string;
}

// ===== Render Comment ===== //
function renderComment(data) {

    console.log(data);

    let newDate = getDate(data.date);
    let inject = `
    <div>
        <p>
            ${data.comment}
        </p>

        <div class="post-author">
            <div class="post-creation">
                <button><i class="far fa-thumbs-up"></i> </button>
                <button><i class="far fa-thumbs-down"></i> </button>
                <h5 class="post-name">${data.fullname}</h5>
                <h5 class="post-date">${newDate}</h5>
            </div>
        </div>
    </div>`;

    let parent = document.getElementById(`comment-history${data.parent}`);
    parent.innerHTML += inject;


}

// ===== Render Vote ===== //
function renderVote(data) {

    console.log(data);

     let upvotes = `<i class="far fa-thumbs-up"></i>${data.upsize}`;
     let downvotes = `<i class="far fa-thumbs-down"></i>${data.downsize}`;
     let postup = document.getElementById(`upvotes${data.post}`);
     let postdown = document.getElementById(`downvotes${data.post}`);
     postup.innerHTML = upvotes;
     postdown.innerHTML = downvotes;
     
}


// ===== Download ===== //
function download(link) {
    window.open(link);
}

// ===== Get Post ===== //
function comment(str) {
    let string = str.slice(1);
    console.log(string);
}

// ===== Get Date ===== //
function getDate(input) {
    let curDate = new Date(input);
    return `${curDate.getFullYear()}-${`0${curDate.getMonth()}`.slice(-2)}-${`0${curDate.getDate()}`.slice(-2)} ${`0${curDate.getHours()}`.slice(-2)}:${`0${curDate.getMinutes()}`.slice(-2)}:${`0${curDate.getSeconds()}`.slice(-2)}`;
}

// ===== Update Comment Listener ===== //
function updateCommentListeners(type, sock, input) {
    if (type === `class`) {

        let scomment = this.document.getElementsByClassName(`scomment`);
        Array.from(scomment).forEach(elem => {
            elem.onclick = (event) => {
                let
                    id = event.target.id.slice(1),
                    pc_comment = this.document.getElementById(`pc-comment${id}`);

                sock.emit(`scomment`, {
                    post_id: id,
                    content: {
                        user_id: 1,
                        comment: pc_comment.value,
                    }
                });

                // resets the values in the form
                pc_comment.value = ``;
            }
        });
    }
    else if (type === `id`) {
        this.document.getElementById(`c${input}`).onclick = (event) => {
            let pc_comment = this.document.getElementById(`pc-comment${input}`);

            this.console.log(pc_comment.value);
            sock.emit(`scomment`, {
                post_id: input,
                content: {
                    user_id: 1,
                    comment: pc_comment.value,
                }
            });

            // resets the values in the form
            pc_comment.value = ``;
        }
    }

}

// ===== Swap Portal ===== //
function swapPortal(page) {
    if (page === `login`) {
        document.getElementsByClassName(`login`)[0].classList.add(`hidden`);
        document.getElementsByClassName(`signup`)[0].classList.remove(`hidden`);
    }
    else {
        document.getElementsByClassName(`login`)[0].classList.remove(`hidden`);
        document.getElementsByClassName(`signup`)[0].classList.add(`hidden`);
    }
    return false;
}