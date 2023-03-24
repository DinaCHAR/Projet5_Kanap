//récupération et affichage orderId
function getOrderIdConfirm() {
    const orderId = document.querySelector("#orderId")
    orderId.innerHTML =  getIdConfirm()
    
    localStorage.clear()
}
getOrderIdConfirm()

// fonction pour avoir la confirmation
function getIdConfirm() {
    const recoveryId = window.location.search;
    return recoveryId.slice(7);
}
