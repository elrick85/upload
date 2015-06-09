/**
 * Created by zauri_000 on 08.06.2015.
 */
(function(window) {

    var placeholderTmpl = "<tr class=\"placeholder\"><td colspan=\"3\">Drop file</td></tr>";
    var currenttable;

    document.addEventListener("mouseup", function(ev) {
        if (!currenttable) {
            return;
        }

        var coords = currenttable.mouseCoords(ev);

        if (currenttable.dragObject) {
            currenttable.position = currenttable.getPosition(currenttable.element);

            if (coords.x < currenttable.position.x || coords.x > currenttable.position.right || coords.y < currenttable.position.y || coords.y > currenttable.position.bottom) {
                currenttable._removeRow(currenttable.dragObject.element);
            }

            currenttable.dragObject = null;
            //currenttable.onDrop(currenttable.table, droppedRow);

            currenttable = null;
        }
    });

    function Widget(element) {
        // wrapper
        var self = this;
        self.element = element;
        self.wrapper = document.createElement("div");
        self.wrapper.className = "wrapper";
        element.parentElement.insertBefore(self.wrapper, element);
        self.wrapper.appendChild(element);

        element.innerHTML = "<table class=\"data-table\">" +
            "<colgroup><col width=\"200\"><col width=\"70\"><col width=\"130\"></colgroup>" +
            "<thead><tr><th>Name</th><th>Size</th><th>date modified</th></tr></thead>" +
            "<tbody>" + placeholderTmpl + "</tbody>";

        self.table = element.querySelector("table");

        var onDragover = function(e) {
            e.preventDefault();

            if (!/\shover/.test(self.table.className)) {
                self.table.className = self.table.className + " hover";
            }
        };

        var onDragleave = function(e) {
            e.preventDefault();
            self.table.className = self.table.className.replace(" hover", "");
        };

        var onDrop = function(e) {
            e.preventDefault();

            var file = e.dataTransfer.files[0];

            self.table.className = self.table.className.replace(" hover", "");
            file && self._addRow(file);
        };

        var nodeList = self.table.querySelectorAll("td");
        nodeList.ondragover = onDragover;
        nodeList.ondragleave = onDragleave;

        self.table.ondragover = onDragover;
        self.table.ondragleave = onDragleave;
        self.table.ondrop = onDrop;
        self.position = self.getPosition(element);

        element.addEventListener("mouseup", function() {
            if (!self.dragObject) {
                self._addRow(currenttable.dragObject.data);
            }
        });
    }

    Widget.prototype.getPosition = function(e) {
        var left = 0;
        var top = 0;
        var right = e.offsetWidth;
        var bottom = e.offsetHeight;

        while (e.offsetParent) {
            left += e.offsetLeft;
            top += e.offsetTop;
            e = e.offsetParent;
        }

        left += e.offsetLeft;
        top += e.offsetTop;

        return { x: left, y: top, right: left + right, bottom: top + bottom };
    };

    Widget.prototype.mouseCoords = function(ev) {
        if (ev.pageX || ev.pageY) {
            return { x: ev.pageX, y: ev.pageY };
        }
        return {
            x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: ev.clientY + document.body.scrollTop - document.body.clientTop
        };
    };

    Widget.prototype.makeDraggable = function(item, data) {
        var self = this;

        if (!item) {
            return;
        }

        item.onmousedown = function(ev) {
            ev.preventDefault();

            currenttable = self;
            self.dragObject = { element: this, data: data };
        };

        item.style.cursor = "move";
    };

    Widget.prototype._removeRow = function(row) {
        var self = this,
            tbody = this.table.querySelector("tbody");

        tbody.removeChild(row);
        !tbody.querySelectorAll("tr").length && (tbody.innerHTML = placeholderTmpl);
        self.position = self.getPosition(self.element);
    };

    // add row to table.
    Widget.prototype._addRow = function(data) {
        var self = this;
        var row = document.createElement("tr"),
            tbody = this.table.querySelector("tbody"),
            placeholder = tbody.querySelector("tr.placeholder");

        row.innerHTML = "<td></td><td></td><td></td>";

        var cells = row.querySelectorAll("td");
        cells[0].appendChild(document.createTextNode(data.name));
        cells[1].appendChild(document.createTextNode(data.size));
        cells[2].appendChild(document.createTextNode(formatDate(data.lastModifiedDate)));

        placeholder && tbody.removeChild(placeholder);
        this.makeDraggable(row, data);
        tbody.appendChild(row);

        self.position = self.getPosition(self.element);
    };

    /*Widget.prototype.serialize = function() {

    };*/

    // Format input date.
    function formatDate(date) {
        var day = date.getDate(),
            month = date.getMonth();

        day < 10 && (day = "0" + day);
        month < 10 && (month = "0" + month);

        return day + "." + month + "." + date.getFullYear()
    }

    window.uploadWidget = {
        create: function(element) {
            return new Widget(element);
        }
    };

})(window);