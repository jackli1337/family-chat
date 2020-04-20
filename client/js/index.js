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
    this.document.getElementById(`scomment`).onclick = () => {
        let
            pc_comment = this.document.getElementById(`pc-comment`),
            pc_file = this.document.getElementById(`pc-file`);

        sock.emit(`scomment`, {
            associated: this.comment(),
            content: {
                userID: 1,
                comment: pc_comment.value,
                file: pc_file.vlaue
            }
        });

        // resets the values in the form
        pc_comment.value = ``;
        pc_file.value = ``;
    };

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
    });
    sock.on(`scomment`, (data) => {
        renderComment(data);
    });
};


/* ---------- Front-End Features ---------- */

// ===== Render Post ===== //
function renderPost(data) {
    // injects template with non-user generated content
    // *** need to create a function that checks for valid file name (done in App.js?)
    console.info(data);
    let inject = `
        <div class="post">
            <div class="post-author">
                <div class="post-pfp">
                    <img src="/img/Profile%20Picture.png">
                </div>
                <div class="post-creation">
                    <a class="post-name">${data.user_id}</a>
                    <a class="post-date">April 11th, 2020</a>
                </div>
            </div>

            <div class="post-body">
                <h1 id="postTitle${data._id.toString()}"></h1>
                <p id="postContent${data._id.toString()}"></p>
                <img src="${data.filepath}">
            </div>

            <div class="post-tools">
                <button><i class="far fa-thumbs-up"></i> ${data.upvote.length}</button>
                <button><i class="far fa-thumbs-down"></i> ${data.downvote.length}</button>
                <button onclick="saveImage()"><i class="fas fa-file-download"></i></button>
                <button><i class="fas fa-share"></i></button>
            </div>

            <div class="post-comments">
                <textarea class="comment" wrap="hard" placeholder="Add a comment..."></textarea>
                <input type="file" accept="image/png, image/jpeg">
                <input id="c${data._id.toString()}" type="submit" onsubmit="comment(this.id)" value="Comment" />
            </div>
        </div>`;

    // update website with BLANK template
    let feed = document.getElementById(`feedView`);
    feed.innerHTML += inject;

    // target the blank template and update (each is unique because each post has a unique id from server)
    let
        postTitle = document.getElementById(`postTitle${data._id.toString()}`),
        postContent = document.getElementById(`postContent${data._id.toString()}`),
        // createTextNode prevents attacks, all data is rendered as text
        postTitleData = document.createTextNode(data.content.title),
        postContentData = document.createTextNode(data.content.post);

    postTitle.appendChild(postTitleData);
    postContent.appendChild(postContentData);
}

// ===== Render Comment ===== //
function renderComment(data) {

}

// ===== Download ===== //
function download(link) {
    window.open(link);
}

// ===== GetPost ===== //
function comment(str) {
    let string = str.slice(1);
    console.log(string);
}