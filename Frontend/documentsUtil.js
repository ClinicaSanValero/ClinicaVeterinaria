import Toastify from 'toastify-js';
import 'Toastify-js/src/Toastify.css';


const el = function (elementId) {
    return document.getElementById(elementId);

};

const notifyError = function(message){
    Toastify({
        text: message,
        duration: 3000,
        gravity: 'top',
        position: 'center',
        style: {
            background: "red"
        },
    }).showToast();
};

const notifyOk = function(message){
    Toastify({
            text: message,
            duration: 3000,
            gravity: 'bottom',
            position: 'right', 
            style: {
                background: "green"
            },
        }).showToast();
};

module.exports = {
    el,
    icon,
    notifyError,
    notifyOk
};