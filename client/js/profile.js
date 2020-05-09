// javascript

/* ---------- Websocket (wss) ---------- */
window.onload = function viaWebSocket() {
    let sock = io.connect(`${window.location.host}`);

    // ===== Submit a Post ===== //
    // event listener waiting for action on "post" button
    this.updateFollowListener(sock);

    // ===== Listener ===== //
    sock.on(`sfollow`, (data) => {
        renderFollow(data);
        this.updateFollowListener(sock);
    });
};


/* ---------- Front-End Features ---------- */

// ===== Render Follow ===== //
function renderFollow(data) {
    // injects template with non-user generated content
    // *** need to create a function that checks for valid file name (done in App.js?)
    console.info(data);
    let button = document.getElementsByClassName(`follow-button`)[0];

    if (data === 'severed') {
        button.innerHTML = "Follow";
    }
    else {
        button.innerHTML = "Unfollow";
    }
}

// ===== Update Follow Listener ===== //
function updateFollowListener(sock) {

    document.getElementsByClassName(`follow-button`)[0].onclick = () => {
        // grabbing values from the form
        let
            id = event.target.id;

        // sends data via websocket (sent as an object)
        sock.emit(`sfollow`, {
            targetID: id
        });
    };
}
