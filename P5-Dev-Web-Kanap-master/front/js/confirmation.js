//récupération et affichage orderId Requête JSON contenant un objet de contact et un tableau de produits
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
