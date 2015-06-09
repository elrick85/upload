/**
 * Created by zauri_000 on 08.06.2015.
 */
window.onload = function () {
    var elem1 = document.getElementById("first-widget");
    var w1 = window.uploadWidget.create(elem1);
    var elem2 = document.getElementById("second-widget");
    var w2 = window.uploadWidget.create(elem2);
    var w1ParentElement = w1.element.parentElement;
    var w2ParentElement = w2.element.parentElement;
    var w1Result = w1ParentElement.querySelector(".result");
    var w2Result = w2ParentElement.querySelector(".result");

    w1ParentElement.querySelector(".serialize").addEventListener("click", function(e) {
        e.preventDefault();
        w1Result.innerText = JSON.stringify(w1.serialize());
    });

    w2ParentElement.querySelector(".serialize").addEventListener("click", function(e) {
        e.preventDefault();
        w2Result.innerText = JSON.stringify(w2.serialize());
    });
};