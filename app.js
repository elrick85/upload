/**
 * Created by zauri_000 on 08.06.2015.
 */
window.onload = function() {
    var w1 = window.uploadWidget.create(document.getElementById("first-widget")),
        w2 = window.uploadWidget.create(document.getElementById("second-widget")),
        w1ParentElement = w1.element.parentElement,
        w2ParentElement = w2.element.parentElement,
        w1Result = w1ParentElement.querySelector(".result"),
        w2Result = w2ParentElement.querySelector(".result");

    w1ParentElement.querySelector(".serialize").addEventListener("click", function(e) {
        e.preventDefault();
        w1Result.innerText = JSON.stringify(w1.serialize());
    });

    w2ParentElement.querySelector(".serialize").addEventListener("click", function(e) {
        e.preventDefault();
        w2Result.innerText = JSON.stringify(w2.serialize());
    });
};