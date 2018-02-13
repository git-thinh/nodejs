/*================================================================*/
/*=== ALERT POPUP MODAL ===*/
/*================================================================*/

/**
* Alert show modal popup bootstrap
* @param options = { type: 'complete|error', title: '', content: '', ok: function{}, cancel: function{}  }
*/
function alertShow(options) {
    if (sessionStorage['alert-id'] != null && sessionStorage['alert-id'] != '') return;
    if (options == null) return;

    /** create id modal */
    var id = 'alert-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    /** create event click */
    var hasOK = false, hasCancel = false;
    var evok = options['ok'];
    if (evok != null && typeof (evok) == 'function') {
        var btnOK = document.createElement('input');
        btnOK.style.display = 'none';
        btnOK.id = 'btn-ok-' + id;
        document.body.appendChild(btnOK);
        btnOK.addEventListener("click", evok);
        hasOK = true;
    }

    var evcacnel = options['cancel'];
    if (evcacnel != null && typeof (evcacnel) == 'function') {
        var btnCancel = document.createElement('input');
        btnCancel.style.display = 'none';
        btnCancel.id = 'btn-cancel-' + id;
        document.body.appendChild(btnCancel);
        btnCancel.addEventListener("click", evcacnel);
        hasCancel = true;
    }

    /** render UI modal popup */
    var type = options['type'], title = options['title'], content = options['content'];
    var m_header = '', m_content = '', m_footer = '';
    if (content == null) content = '';

    switch (type) {
        case 'complete':
            m_header = '';
            if (content == '') content = 'Complete';
            m_footer =
                    '<div class="modal-footer">' +
                    '    <button onclick="alertClose(\'' + id + '\',\'btn-ok-' + id + '\')" type="button" class="btn _btn-webui _btn-width">OK</button>' +
                    '</div>';
            break;
        case 'error':
            if (title == null || title == '') title = 'Error';
            m_header =
                    '<div class="modal-header error">' +
                    '    <button type="button" class="close" onclick="alertClose(\'' + id + '\',\'btn-cancel-' + id + '\')">&times;</button>' +
                    '    <h4 class="modal-title">' + title + '</h4>' +
                    '</div>';
            m_footer =
                    '<div class="modal-footer">' +
                    '    <button onclick="alertClose(\'' + id + '\',\'btn-cancel-' + id + '\')" type="button" class="btn _btn-webui _btn-width">OK</button>' +
                    '</div>';
            break;
        case 'confirm':
            if (title != null && title.length > 0)
                m_header =
                        '<div class="modal-header confirm">' +
                        '    <button type="button" class="close" onclick="alertClose(\'' + id + '\',\'btn-cancel-' + id + '\')">&times;</button>' +
                        '    <h4 class="modal-title">' + title + '</h4>' +
                        '</div>';
            if (hasCancel || hasOK)
                m_footer =
                        '<div class="modal-footer">' +
                        (hasOK ? '    <button onclick="alertOK(\'' + id + '\')" type="button" class="btn _btn-webui _btn-width">OK</button>' : '') +
                        (hasCancel ? '    <button onclick="alertClose(\'' + id + '\',\'btn-cancel-' + id + '\')" type="button" class="btn _btn-width">Cancel</button>' : '') +
                        '</div>';
            break;
        default:
            if (title != null || title != '') {
                m_header =
                    '<div class="modal-header">' +
                    '    <button type="button" class="close" onclick="alertClose(\'' + id + '\')">&times;</button>' +
                    '    <h4 class="modal-title">' + title + '</h4>' +
                    '</div>';
            }
            break;
    }
    m_content = '<p>' + content + '</p>';

    var htmModal =
    '    <div id="' + id + '" class="modal fade" role="dialog">' +
    '        <div class="modal-dialog">                        ' +
    '            <div class="modal-content">                   ' +
    m_header +
    '                <div class="modal-body">                  ' +
    m_content +
    '                </div>                                    ' +
    m_footer +
    '            </div>                                        ' +
    '        </div>                                            ' +
    '    </div>                                                ';
    
    var input = document.createElement('input');
    input.style = 'border:none;width:1px;height:1px;';
    input.id = 'input-' + id;
    document.body.appendChild(input);
    input.select();
    input.focus();

    $('body').append(htmModal);
    $('#' + id).modal('show');
    sessionStorage['alert-id'] = id;
    $('#' + id).on('hidden.bs.modal', function (ev) {
        alertClose(id);
    });
}

/**
* Alert close popup modal showing
*/
function alertClose(id, btnid) {
    sessionStorage['alert-id'] = '';
    var btnCancel = document.getElementById(btnid);
    if (btnCancel != null) btnCancel.click();

    $('#input-' + id).remove();
    $('#btn-ok-' + id).remove();
    $('#btn-cancel-' + id).remove();

    $('#' + id).remove();
    $('div.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    $('body').css({ 'padding-right': '0px' });
}

function alertOK(id) {
    sessionStorage['alert-id'] = '';
    var btnOK = document.getElementById('btn-ok-' + id);
    if (btnOK != null) btnOK.click();

    $('#input-' + id).remove();
    $('#btn-ok-' + id).remove();
    $('#btn-cancel-' + id).remove();

    $('#' + id).remove();
    $('div.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    $('body').css({ 'padding-right': '0px' });
}

