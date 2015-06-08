/**
 * Created by zauri_000 on 08.06.2015.
 */
(function (window) {

    function widget(element) {
        // wrapper
        var self = this;
        self.wrapper = document.createElement("div");
        self.wrapper.className = "wrapper";
        element.parentElement.insertBefore(self.wrapper, element);
        self.wrapper.appendChild(element);

        element.innerHTML = "<table class=\"data-table\">" +
            "<colgroup><col width=\"150\"><col width=\"50\"><col width=\"100\"></colgroup>" +
            "<thead><tr><th>Name</th><th>Size</th><th>date modified</th></tr></thead>" +
            "<tbody></tbody>" +
            "<tfoot><tr><td colspan=\"3\"><a href=\"#\">Add file</a></td></tr></tfoot></table>";

        self.table = element.querySelector("table");

        var onDragover = function (e) {
            e.preventDefault();

            if (!/\shover/.test(self.table.className)) {
                self.table.className = self.table.className + " hover";
            }
        };

        var onDragleave = function (e) {
            e.preventDefault();
            self.table.className = self.table.className.replace(" hover", "");
        };

        var onDrop = function (e) {
            e.preventDefault();

            var file = e.dataTransfer.files[0];

            file && self._addRow(file);
        };

        var nodeList = self.table.querySelectorAll("td");
        nodeList.ondragover = onDragover;
        nodeList.ondragleave = onDragleave;

        self.table.ondragover = onDragover;
        self.table.ondragleave = onDragleave;
        self.table.ondrop = onDrop;

        console.log(element.parentElement);
    }

    // add row to table.
    widget.prototype._addRow = function (data) {
        var row = document.createElement("tr");
        row.innerHTML = "<td></td><td></td><td></td>";

        var cells = row.querySelectorAll("td");
        cells[0].appendChild(document.createTextNode(data.name));
        cells[1].appendChild(document.createTextNode(data.size));
        cells[2].appendChild(document.createTextNode(formatDate(data.lastModifiedDate)));

        this.table.querySelector("tbody").appendChild(row);
    };

    widget.prototype.serialize = function () {

    };

    // Format input date.
    function formatDate(date) {
        var day = date.getDate(),
            month = date.getMonth();

        day < 10 && (day = "0" + day);
        month < 10 && (month = "0" + month);

        return day + "." + month + "." + date.getFullYear()
    }

    window.uploadWidget = {
        create: function (element) {
            return new widget(element);
        },


    };

})(window);