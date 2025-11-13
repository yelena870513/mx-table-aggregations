import React, { useRef, useCallback, useMemo, createElement } from "react";
import { SimpleTable } from "simple-table-core";
// import { HEADERS } from "./manufacturing-headers";
import "simple-table-core/styles.css";
import "./ui/TableWithSubTotalJs.css";
import "./ui/simple-theme.css";
import { Util } from "./util/utils";
import { v4 as uuidv4 } from "uuid";
import { Footer } from "./manufacturing-footer";

export function TableWithSubTotalJs(props) {
    const {
        onClickAction,
        datasource,
        grouping,
        aggregator,
        isAggregated,
        tableFields,
        pageSize,
        aggregatorCaption,
        loadingText,
        theme
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
                {loadingText || "Loading data..."}
            </div>
        );
    }

    let headers = Util.getColumnsConfig(labels);
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
                    theme={theme}
                    useOddEvenRowBackground={true}
                    useHoverRowBackground={true}
                    footerRenderer={({
    
    totalRows,
    totalPages,
    hasPrevPage,
    hasNextPage,
    onPrevPage,
    onNextPage,
    onPageChange,
    nextIcon,
    prevIcon
}) => {
    return (
        <div className="st-footer">
            {/* Left side - Row info */}
            <div className="st-footer-info">
                <span className="st-footer-results-text">Total: {totalRows}</span>
            </div>

            {/* Right side - Page controls */}
            <div className="st-footer-pagination">
                <button onClick={onPrevPage}
                disabled={!hasPrevPage} className="st-next-prev-btn ">{prevIcon}</button>

                {/* Page numbers */}
                <div>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button  className="st-page-btn" key={page} onClick={() => onPageChange(page)}>
                            {page}
                        </button>
                    ))}
                </div>

                <button  onClick={onNextPage}
                disabled={!hasNextPage} className="st-next-prev-btn">{nextIcon}</button>
            </div>
        </div>
    );
}}
                />
            </div>
        );
    }
    dataRows = [...Util.getGroupByAggregator(dataRows, grouping.id)];
    headers = [...Util.getColumnsConfigRow(labels, grouping, aggregator, aggregatorCaption)];

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
                theme={theme}
                useOddEvenRowBackground={true}
                useHoverRowBackground={true}
                footerRenderer={({
    
    totalRows,
    totalPages,
    hasPrevPage,
    hasNextPage,
    onPrevPage,
    onNextPage,
    onPageChange,
    nextIcon,
    prevIcon
}) => {
    return (
        <div className="st-footer">
            {/* Left side - Row info */}
            <div className="st-footer-info">
                <span className="st-footer-results-text">Total: {totalRows}</span>
            </div>

            {/* Right side - Page controls */}
            <div className="st-footer-pagination">
                <button onClick={onPrevPage}
                disabled={!hasPrevPage} className="st-next-prev-btn ">{prevIcon}</button>

                {/* Page numbers */}
                <div>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button  className="st-page-btn" key={page} onClick={() => onPageChange(page)}>
                            {page}
                        </button>
                    ))}
                </div>

                <button  onClick={onNextPage}
                disabled={!hasNextPage} className="st-next-prev-btn">{nextIcon}</button>
            </div>
        </div>
    );
}}
            />
        </div>
    );
}
