import React, { useRef, useCallback, useMemo, createElement } from "react";
import { SimpleTable } from "simple-table-core";
// import { HEADERS } from "./manufacturing-headers";
import "./ui/TableWithSubTotalJs.css";
import "simple-table-core/styles.css";
import { Util } from "./util/utils";
import { v4 as uuidv4 } from "uuid";

export function TableWithSubTotalJs(props) {
    const {
        onClickAction,
        datasource,
        grouping,
        aggregator,
        isAggregated,
        tableFields,
        pageSize,
        hasFilter,
        aggregatorCaption
    } = props;
    const onClickHandler = useCallback(() => {
        if (onClickAction && onClickAction.canExecute) {
            onClickAction.execute();
        }
    }, [onClickAction]);

    const labels = useMemo(() => Util.transformColumnProps(tableFields), [tableFields]);
    const id = useRef(`SimpleTable${uuidv4()}`);

    // Define headers
    if (
        !datasource ||
        !datasource.items ||
        datasource.items.length === 0 ||
        datasource.status.toLowerCase() !== "available"
    ) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "70dvh",
                    fontSize: "16px",
                    color: "#666"
                }}
            >
                Loading data...
            </div>
        );
    }

    let headers = Util.getColumnsConfig(labels, hasFilter);
    let dataRows = Util.getDataRows(labels, datasource.items);
    if (!isAggregated) {
        return (
            <div>
                <SimpleTable
                    columnResizing
                    columnReordering
                    selectableCells={false}
                    shouldPaginate={true}
                    defaultHeaders={headers}
                    height={"70dvh"}
                    rows={dataRows}
                    rowIdAccessor={"id"}
                    id={id.current}
                    rowsPerPage={pageSize}
                    editColumns={true}
                />
            </div>
        );
    }
    dataRows = [...Util.getGroupByAggregator(dataRows, grouping.id)];
    headers = [...Util.getColumnsConfigRow(labels, grouping, aggregator, hasFilter, aggregatorCaption)];

    return (
        <div>
            <SimpleTable
                columnResizing
                columnReordering
                selectableCells={false}
                shouldPaginate={true}
                defaultHeaders={headers}
                height={"70dvh"}
                rowGrouping={["items"]}
                rows={dataRows}
                rowIdAccessor={"id"}
                id={id.current}
                rowsPerPage={pageSize}
                editColumns={true}
            />
        </div>
    );
}
