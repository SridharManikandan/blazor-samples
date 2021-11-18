﻿window.addEventListener('resize', function () {
    setReportsHeight();
});

function loadTabContent(reportSampleData, reportBasePath, reportRouterPath, sourceCode, isPreview) {
    if (!isPreview) {
    $('#parentTab li:first-child a').tab('show');
    $('#childtTab li:first-child a').tab('show');
    let childaTab = document.getElementById("childTabContainer");
    let cshtml = sourceCode;
    childaTab.getElementsByClassName('csharp-header')[0].textContent = reportRouterPath+'.razor';
    childaTab.getElementsByClassName('csharp-content')[0].innerHTML = Prism.highlight(cshtml, Prism.languages.csharp);
    }
}

function hideSpinner() {
    if (document.querySelector(".splash") !== null && document.querySelector('.ej-body.e-hidden') !== null) {
        document.querySelector(".splash").classList.add('e-hidden');
        document.querySelector('.ej-body.e-hidden').classList.remove('e-hidden');
    }
    setReportsHeight();
}

function setReportsHeight () {
    if (!location.href.includes('/ReportDesigner') && !location.href.includes('/Preview')) {
        let style = document.getElementById('reports-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'reports-style';
            document.body.appendChild(style);
        }
        style.textContent = 'ej-sample { display:block; overflow: hidden; height:' + (window.innerHeight -
            (document.getElementById('parentTabContent').getBoundingClientRect().top - document.body.getBoundingClientRect().top)) + 'px}';
    }
}

function highlightSideBarItem() {
    if (location.href.includes('ReportViewer') && !location.href.includes('Preview')) {
        var activeElement = document.getElementsByClassName("ej-sb-toc-card toc-selected")[0];
        activeElement.focus();
    }
}

function resizeViewer() {
    let reportViewerElement = document.querySelector('.e-reportviewer.e-js');
    if (reportViewerElement) $(reportViewerElement).trigger('resize');
}

function openInNewTab(url) {
    window.open(url, '_blank');
}

function openInCurrentWindow(url) {
    window.open(location.origin + url, '_self')
}

function onHomeBtnClick() {
    let homePageUrl = location.origin.indexOf('demos.boldreports.com') !== -1 ? '/home/' : '/';
    location.href = location.origin + homePageUrl + 'blazor.html';
}

function onHamBurgerClick() {
    if (window.matchMedia('(max-width:550px)').matches) {
        let mobileOverlay = document.querySelector('.mobile-overlay');
        let mobileSideBar = document.querySelector('ej-sidebar');
        if (mobileSideBar.classList.contains('ej-toc-mobile-slide-left')) {
            mobileSideBar.classList.remove('ej-toc-mobile-slide-left');
            mobileOverlay.classList.add('e-hidden');
        } else {
            mobileSideBar.classList.add('ej-toc-mobile-slide-left');
            mobileOverlay.classList.remove('e-hidden');
        }
    } else {
        let desktopSidebar = document.querySelector('.ej-main-parent-content');
        let classFn = desktopSidebar.classList.contains('ej-toc-slide-left') ? 'remove' : 'add';
        desktopSidebar.classList[classFn]('ej-toc-slide-left');
    }
    setTimeout(function () {
        resizeViewer();
 }, 200)
}

function onMobileOverlayClick() {
    onHamBurgerClick();
}