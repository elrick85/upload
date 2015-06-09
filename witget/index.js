/**
 * Created by zauri_000 on 08.06.2015.
 */
(function(window) {

    var placeholderTmpl = "<tr class=\"placeholder\"><td colspan=\"3\">Drop file</td></tr>";
    var widgetTmpl = "<table class=\"data-table\">" +
        "<colgroup><col width=\"200\"><col width=\"70\"><col width=\"130\"></colgroup>" +
        "<thead><tr><th>Name</th><th>Size</th><th>date modified</th></tr></thead>" +
        "<tbody>" + placeholderTmpl + "</tbody>";
    var currenttable;

    document.addEventListener("mouseup", function(ev) {
        setTimeout(function() {
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
                currenttable = null;
            }
        }, 0);
    });

    /**
     * Widget module.
     * @param element
     * @constructor
     */
    function Widget(element) {
        var self = this;

        self.element = element;
        self.element.innerHTML = widgetTmpl;
        self.source = [];
        self.table = self.element.querySelector("table");

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

            var files = e.dataTransfer.files;

            self.table.className = self.table.className.replace(" hover", "");
            var i = 0, length = files.length;

            for (; i < length; i++) {
                files[i] && self._addRow(files[i]);
            }
        };

        self.position = self.getPosition(element);
        self.table.ondragover = onDragover;
        self.table.ondragleave = onDragleave;
        self.table.ondrop = onDrop;
        self.element.onmouseover = onDragover;
        self.element.onmouseleave = onDragleave;
        self.element.onmouseup = function() {
            if (!self.dragObject) {
                self._addRow(currenttable.dragObject.data);
            }
        };
    }

    /**
     * Return position of element.
     * @param element
     * @returns {{x: number, y: number, right: number, bottom: number}}
     */
    Widget.prototype.getPosition = function(element) {
        var left = 0;
        var top = 0;
        var right = element.offsetWidth;
        var bottom = element.offsetHeight;

        while (element.offsetParent) {
            left += element.offsetLeft;
            top += element.offsetTop;
            element = element.offsetParent;
        }

        left += element.offsetLeft;
        top += element.offsetTop;

        return { x: left, y: top, right: left + right, bottom: top + bottom };
    };

    /**
     * Return pointer position.
     * @param ev
     * @returns {{x: (Number|number), y: (number|Number)}}
     */
    Widget.prototype.mouseCoords = function(ev) {
        return {
            x: ev.clientX,
            y: ev.clientY
        };
    };

    /**
     * Make row draggable.
     * @param item
     * @param data
     */
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

    /**
     * Remove existing row.
     * @param row
     * @private
     */
    Widget.prototype._removeRow = function(row) {
        var self = this,
            tbody = this.table.querySelector("tbody");

        var index = Array.prototype.indexOf.call(tbody.querySelectorAll("tr"), row);

        self.source.splice(index, 1);

        tbody.removeChild(row);
        !tbody.querySelectorAll("tr").length && (tbody.innerHTML = placeholderTmpl);
        self.position = self.getPosition(self.element);
    };

    /**
     * Insert row in widget.
     * @param data
     * @private
     */
    Widget.prototype._addRow = function(data) {
        var self = this;
        var tbody = self.table.querySelector("tbody"),
            placeholder = tbody.querySelector("tr.placeholder"),
            model = {
                name: data.name,
                size: data.size,
                lastModifiedDate: data.lastModifiedDate
            },
            row = createRow(model);

        placeholder && tbody.removeChild(placeholder);
        self.makeDraggable(row, model);
        tbody.appendChild(row);
        self.source.push(model);

        self.position = self.getPosition(self.element);
    };

    /**
     * Serialize widget source.
     * @returns {{data: Array, total: Number}}
     */
    Widget.prototype.serialize = function() {
        return {
            data: this.source,
            total: this.source.length
        };
    };

    // Create row from data.
    function createRow(data) {
        var row = document.createElement("tr");

        row.innerHTML = "<td></td><td></td><td></td>";

        var cells = row.querySelectorAll("td");
        cells[0].appendChild(document.createTextNode(data.name));
        cells[1].appendChild(document.createTextNode(data.size));
        cells[2].appendChild(document.createTextNode(formatDate(data.lastModifiedDate)));

        return row;
    }

    // Format input date.
    function formatDate(date) {
        var day = date.getDate(),
            month = date.getMonth();

        day < 10 && (day = "0" + day);
        month < 10 && (month = "0" + month);

        return day + "." + month + "." + date.getFullYear()
    }

    // Widget interface.
    window.uploadWidget = {
        create: function(element) {
            return new Widget(element);
        }
    };

})(window);