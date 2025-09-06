document.addEventListener('DOMContentLoaded', () => {
    const strawberries = document.querySelectorAll('.strawberry');
    const messageBox = document.getElementById('message-box');

    strawberries.forEach(strawberry => {
        strawberry.addEventListener('click', () => {
            const message = strawberry.dataset.message;
            showMessage(message);
        });
    });

    function showMessage(msg) {
        messageBox.textContent = msg;
        messageBox.classList.remove('hidden');

        // 自動隱藏訊息框，可以調整時間
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 3000);
    }
});
