import React, { createElement } from "react";
import { v4 as uuidv4 } from "uuid";

export const Util = {
    transformColumnProps(props) {
        return props.map(prop => ({
            ...prop,
            header: (prop.header && prop.header.value) ?? ""
        }));
    },

    getColumnsConfig(labels, hasFilter) {
        return labels.map(label => {
            const header = {
                accessor: label.attribute.id,
                label: label.header.toString(),
                minWidth: 80,
                width: "1fr",
                isSortable: true,
                type: label.attribute.type.toLowerCase(),
                isEditable: false,
                filterable: hasFilter
            };
            return header;
        });
    },
    getColumnsConfigRow(labels, grouper, agregator, hasFilter,aggregatorCaption) {
        return labels.map((label, index) => {
            let header = {
                accessor: label.attribute.id,
                label: label.header.toString(),
                minWidth: 80,
                width: "1fr",
                isSortable: true,
                type: label.attribute.type.toLowerCase(),
                isEditable: false,
                filterable: hasFilter
            };
            if (index === 0) {
               header={...header, expandable: true,}
            }
            if (grouper.id === label.attribute.id) {
                header = {
                    ...header,
                   
                    cellRenderer: ({ row }) => {
                        const hasChildren = row.items && Array.isArray(row.items);
                        return !hasChildren ? (
                            row[grouper.id]
                        ) : (
                            <span className="font-medium">
                                <b>{aggregatorCaption.value}</b>
                            </span>
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
                        const value = row[label.attribute.id];
                         return !hasChildren ? (
                            <p>{value?.toLocaleString()}</p>
                        ) : (
                            <div className={hasChildren ? "font-bold" : ""}>
                                <b>{value?.toLocaleString()}</b>
                            </div>
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
            values[label.attribute.id] = value ? value.displayValue : "";
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
    }
};
