import React, { createElement } from "react";
import { v4 as uuidv4 } from "uuid";

export const Util = {
    transformColumnProps(props) {
        return props.map(prop => ({
            ...prop,
            header: (prop.header && prop.header.value) ?? "",
            filter: prop.filter
        }));
    },

    getColumnsConfig(labels) {
        return labels.map(label => {
            const header = {
                accessor: label.attribute.id,
                label: label.header.toString(),
                minWidth: 80,
                width: "1fr",
                isSortable: true,
                type: this.getDataType(label.attribute.type.toLowerCase()),
                isEditable: false,
                filterable: label.filter ?? false
            };
            return header;
        });
    },
    getColumnsConfigRow(labels, grouper, agregator, aggregatorCaption) {
        return labels.map((label, index) => {
            let header = {
                accessor: label.attribute.id,
                label: label.header.toString(),
                minWidth: 80,
                width: "1fr",
                isSortable: true,
                type: this.getDataType(label.attribute.type.toLowerCase()),
                isEditable: false
            };
            if (index === 0) {
                header = { ...header, expandable: true };
            }
            if (grouper.id === label.attribute.id) {
                header = {
                    ...header,

                    cellRenderer: ({ row }) => {
                        const hasChildren = row.items && Array.isArray(row.items);
                        return !hasChildren ? (
                            row[grouper.id]
                        ) : (
                            <span className="font-bold">{aggregatorCaption.value}</span>
                        );
                    }
                };
            }
            if (agregator.id === label.attribute.id) {
                header = {
                    ...header,
                    type: "number",
                    aggregation: {
                        type: "sum"
                    },
                    cellRenderer: ({ row }) => {
                        const hasChildren = row.items && Array.isArray(row.items);
                        let value = row[label.attribute.id];
                        if (!hasChildren) {
                            value = value.toString().replace(",", ".");
                        }

                        value = Number(value);

                        return !hasChildren ? (
                            <span>{value.toFixed(3)}</span>
                        ) : (
                            <div className={hasChildren ? "font-bold" : ""}>{value.toFixed(3)}</div>
                        );
                    }
                };
            }
            return header;
        });
    },
    getPropertyValues(labels, item) {
        const values = {
            id: `simple_table_object_${uuidv4()}`
        };
        labels.forEach(label => {
            const value = label.attribute.get(item);
            const type = label.attribute.type.toLowerCase();
            if (type === "decimal") {
                let txtNumber = value.displayValue.replace(",", ".");
                values[label.attribute.id] = Number(txtNumber).toFixed(3) ?? 0;
            } else {
                values[label.attribute.id] = value ? value.displayValue : "";
            }
        });
        return values;
    },
    getDataRows(labels, items) {
        return items.map(item => Util.getPropertyValues(labels, item));
    },
    getGroupByAggregator(arr, groupeId) {
        const grouped = {};
        arr.forEach(item => {
            if (!grouped[item[groupeId]]) {
                grouped[item[groupeId]] = {
                    id: uuidv4(),
                    items: []
                };
                grouped[item[groupeId]][groupeId] = item[groupeId];
            }
            grouped[item[groupeId]].items.push(item);
        });
        return Object.values(grouped);
    },
    getDataType(value) {
        switch (value) {
            case "string":
            case "guid":
            case "date":
            case "datetime":
                return "string";
            case "boolean":
                return "boolean";
            case "integer":
            case "decimal":
            case "nanointeger":
            case "float":
                return "number";
            default:
                return "string";
        }
    }
};
