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
            formElement = this.document.getElementById(`form-post`).value,
            fp_title = this.document.getElementById(`fp-title`).value,
            fp_content = this.document.getElementById(`fp-content`).value,
            fp_file = this.document.getElementById(`fp-file`).value;

        // sends data via websocket (sent as an object)
        sock.emit(`spost`, {
            title: fp_title,
            content: fp_content,
            file: fp_file
        });

        // resets the values in the form
        formElement.reset();
    };

    /* ===== FEEL FREE TO MODIFY LINES 32 - 68 ===== */
    // // ===== Submit a Comment ===== //
    // this.document.getElementById(`scomment`).onclick = () => {
    //     let input = this.document.getElementById(`form-comment`);
    //     sock.emit(`scomment`, {

    //     });
    //     input.value = ``;
    // };

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
}


/* ---------- Front-End Features ---------- */

// ===== Render Post ===== //
function renderPost(data) {
    // injects template with non-user generated content
    // *** need to create a function that checks for valid file name (done in App.js?)
    let inject = `
        <div class="post">
            <div class="post-author">
                <div class="post-pfp">
                    <img src="${data.filepath}">
                </div>
                <div class="post-creation">
                    <a class="post-name"> ${data.user_id}></a>
                    <a class="post-date">April 11th, 2020</a>
                </div>
            </div>

            <div class="post-body">
                <h1 id="postTitle${data.id}"></h1>
                <p id="postContent${data.id}"></p>
                <img src="${data.filepath}">
            </div>

            <div class="post-tools">
                <button><i class="far fa-thumbs-up"></i> ${data.upvote.length}</button>
                <button><i class="far fa-thumbs-down"></i> ${data.downvote.length}</button>
                <button onclick="saveImage()"><i class="fas fa-file-download"></i></button>
                <button><i class="fas fa-share"></i></button>
            </div>

            <form class="post-comments">
                <textarea class="comment" wrap="hard" placeholder="Add a comment..."></textarea>
                <input type="file" accept="image/png, image/jpeg">
                <input type="submit" class="post-send-btn" placeholder="Comment" />
            </form>
        </div>`;

        // update website with BLANK template
    let feed = document.getElementById(`feedView`);
    feed.appendChild(inject);

    // target the blank template and update (each is unique because each post has a unique id from server)
    let
        postTitle = document.getElementById(`postTitle${data.id}`),
        postContent = document.getElementById(`postContent${data.id}`),
        // createTextNode prevents attacks, all data is rendered as text
        postTitleData = document.createTextNode(data.title),
        postContentData = document.createTextNode(data.content);

    postTitle.appendChild(postTitleData);
    postContent.appendChild(postContentData);
}

// ===== Get Feed ===== //
// function getFeed() {
//     let req = new XMLHttpRequest();
//     req.onreadystatechange = () => {
//         if (this.readyState === 4 && this.readyState === 1) {

//         }
//     }
// }

// ===== Download ===== //
function download(link) {
    window.open(link);
}
