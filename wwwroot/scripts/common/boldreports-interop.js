var reportName = getReportName();
let designerInst;
let isServerReoport;

function onReportLoaded(args) {
    if (args.model.reportPath.split('.')[1] == 'rdlc' && (args.model.reportPath != 'load-large-data.rdlc')) {
        let reportNameWithoutExt = args.model.reportPath.split(".")[0];
        let reportObj = $('#report-viewer').data("boldReportViewer");
        reportObj.model.dataSources = rdlcData[reportNameWithoutExt];
    }
}

function previewReport(args) {
    if (isServerReoport) {
        let reportPath = args.model.reportPath;
        reportPath = reportPath.indexOf('//') !== -1 ? reportPath.substring(2) : reportPath
        let reportNameWithoutExt = reportPath.split(".rdlc")[0];
        if (reportNameWithoutExt != "load-large-data") {
            datasource = rdlcData[reportNameWithoutExt];
            args.dataSets = datasource;
        }
        args.cancelDataInputDialog = true;
    }
}

function onReportOpened(args) {
    isServerReoport = args.isServerReport;
}

function controlCreate() {
    designerInst = $('#report_designer').data('boldReportDesigner');
    if (typeof reportName !== "undefined") {
        if (reportName.split('.')[1] == 'rdlc') {
            if (reportName == "load-large-data.rdlc") {
                designerInst.setModel({
                    reportType: 'RDLC',
                    previewReport: previewReport,
                    previewOptions: {
                        exportItemClick: window.Globals.EXPORT_ITEM_CLICK,
                        toolbarSettings: {
                            items: ej.ReportViewer.ToolbarItems.All & ~ej.ReportViewer.ToolbarItems.Export & ~ej.ReportViewer.ToolbarItems.Print
                        }
                    }
                });
            }
            else {
                designerInst.setModel({
                    reportType: 'RDLC',
                    previewReport: previewReport,
                    previewOptions: {
                        exportItemClick: window.Globals.EXPORT_ITEM_CLICK
                    }
                });
            }
            if (reportName) {
                designerInst.openReport(reportName);
            }

        }
        else {
            designerInst.setModel({
                previewOptions: {
                    exportItemClick: window.Globals.EXPORT_ITEM_CLICK
                }
            });
            if (reportName) {
                designerInst.openReport(reportName);
            }
        }
    }
}

function getReportName() {
    const reportNameRegex = /[\\?&]report-name=([^&#]*)/.exec(location.search);
    return reportNameRegex ? reportNameRegex[1] : undefined;
};

window.addEventListener("beforeunload", function () {
    let reportViewerElement = document.querySelector('.e-reportviewer.e-js');
    if (reportViewerElement) $(reportViewerElement).data('boldReportViewer')._ajaxCallMethod("ClearCache", "_clearCurrentServerCache", false);
});

// Interop file to render the Bold Report Viewer component with properties.
window.BoldReports = {
    RenderViewer: function (elementID, reportViewerOptions) {
        $("#" + elementID).boldReportViewer({
            reportPath: reportViewerOptions.reportName,
            reportServiceUrl: getBasePath() + reportViewerOptions.serviceURL,
            toolbarSettings: window.Globals.options(reportViewerOptions.reportName),
            toolBarItemClick: window.Globals.EDIT_REPORT,
            exportItemClick: window.Globals.EXPORT_ITEM_CLICK,
            reportLoaded: onReportLoaded
        });
    },
    RenderDesigner: function (elementID, reportDesignerOptions) {
        $("#" + elementID).boldReportDesigner({
            serviceUrl: getBasePath() + reportDesignerOptions.serviceURL,
            create: controlCreate,
            
            toolbarSettings: {
                items: ej.ReportDesigner.ToolbarItems.All & ~ej.ReportDesigner.ToolbarItems.Save
            },
            ajaxBeforeLoad: window.Globals.onAjaxBeforeLoad,
            reportOpened: onReportOpened,
            toolbarRendering: window.Globals.DESIGNER_TOOLBAR_RENDERING,
            toolbarClick: window.Globals.DESIGNER_TOOLBAR_CLICK
        });
    }
}

window.Globals = {
    options: function (args) {
        if (args == "load-large-data.rdlc") {
            window.Globals.TOOLBAR_OPTIONS.items = ej.ReportViewer.ToolbarItems.All & ~ej.ReportViewer.ToolbarItems.Export & ~ej.ReportViewer.ToolbarItems.Print & ~ej.ReportViewer.ToolbarItems.ExportSetup
        }
        return window.Globals.TOOLBAR_OPTIONS;
    },
    TOOLBAR_OPTIONS: {
        showToolbar: true,
        items: ej.ReportViewer.ToolbarItems.All,
        customGroups: [{
            items: [{
                type: 'Default',
                cssClass: "e-icon e-edit e-reportviewer-icon ej-webicon CustomGroup",
                id: "edit-report",
                // Need to add the proper header and content once, the tool tip issue resolved.
                tooltip: {
                    header: 'Edit Report',
                    content: 'Edit this report in designer'
                }
            }],
            // Need to remove the css (e-reportviewer-toolbarcontainer ul.e-ul:nth-child(4)) once the group index issue resolved
            groupIndex: 3,
            cssClass: "e-show"
        }]
    },
    EDIT_REPORT: function (args) {
        if (args.value == "edit-report") {
            let reportPath = args.model.reportPath;
            let ReportDesignerPath = reportPath.indexOf('.rdlc') !== -1 ? `${getBasePath()}ReportDesigner/RDLC` : `${getBasePath()}ReportDesigner`;
            window.open(location.origin  + ReportDesignerPath + '?report-name=' + reportPath, location.pathname.indexOf('Preview') === -1 ? '_blank' : '_self')

        }
    },
    DESTROY_REPORT: true,
    EXPORT_ITEM_CLICK: function () {
        window.Globals.DESTROY_REPORT = false;
    },
    onAjaxBeforeLoad :function onAjaxBeforeLoad(args) {
    args.data = JSON.stringify({ reportType: "RDL" });
    },
    DESIGNER_TOOLBAR_RENDERING: function (args) {
        if ($(args.target).hasClass('e-rptdesigner-toolbarcontainer')) {
            var saveButton = ej.buildTag('li.e-rptdesigner-toolbarli e-designer-toolbar-align e-tooltxt', '', {}, {});
            var saveIcon = ej.buildTag('span.e-rptdesigner-toolbar-icon e-toolbarfonticonbasic e-rptdesigner-toolbar-save e-li-item', '', {}, { title: 'Save' });
            args.target.find('ul:first').append(saveButton.append(saveIcon));
        }
    },
    DESIGNER_TOOLBAR_CLICK: function (args) {
        if (args.click === 'Save') {
            args.cancel = true;
            $('#container').data('boldReportDesigner').saveToDevice();
        }
    }
}