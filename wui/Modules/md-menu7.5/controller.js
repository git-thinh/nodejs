
function mdmenu75Ctrl($rootScope, $rootScope, $scope, $route, $controller, $http, $timeout, svCore, CONNECTION_ERROR) {
    jQuery('#box-module').hide();

    var dataUser = {};
    var sUser = svCore.getSynchronous(CONFIG.URL_API + 'public/getAllAccount');
    if (sUser == null) {
        jQuery('#box-module').hide();
        alertShow({ type: 'error', content: CONNECTION_ERROR });
        return;
    }
    try {
        dataUser = JSON.parse(sUser);
        //console.log(' GET USER = ', dataUser);
    } catch (err) {
        alertShow({ type: 'error', content: 'Json content format is not correct' });
        jQuery('#box-module').hide();
        return;
    }

    if (svCore.per_error(dataUser)) {
        return;
    }

    /**********************************************************************/

    var label = {};
    var sLabel = svCore.getSynchronous($scope.PATH + 'label-en.json');
    if (sLabel == null) {
        jQuery('#box-module').hide();
        alertShow({ type: 'error', content: CONNECTION_ERROR });
        return;
    }
    try {
        label = JSON.parse(sLabel);
    } catch (err) {
        alertShow({ type: 'error', content: 'Json content format is not correct' });
        jQuery('#box-module').hide();
        return;
    }
    ////$scope.label = label;
    //console.log('LABEL = ', label);

    /**********************************************************************/

    aready(function () {
        jQuery('#box-module').css({ 'height': 'calc(100vh - 46px)' });
        jQuery('#box-module').css({ 'overflow': 'auto' });
        jQuery('#view-module').css({ 'height': 'auto' });
        //jQuery('#box-module').show();

        var aUser = [];
        var lsuser = dataUser['data'];
        for (var i = 0; i < lsuser.length; i++)
            aUser.push(['', '', lsuser[i]]);

        //console.log(' GET USER = ', aUser);


        $.extend(true, $.fn.dataTable.defaults, {
            "searching": true,
            "ordering": false
        });

        var table = $('#tableUser').DataTable({
            sDom: '<"top"f>rt<"bottom"ilp><"clear">',
            responsive: true,
            data: aUser,
            language: { url: '/Modules/md-menu7.5/label-en.json' },
            lengthMenu: [[5, 20, 40, 60, 100, 200], [5, 20, 40, 60, 100, 200]],
            pagingType: 'first_last_numbers',
            columns: [
                { title: label.Res_0705_01_01 },
                { title: '' },
                { title: label.Res_0705_01_02 }
            ],
            columnDefs: [ 
                {
                    searchable: false,
                    orderable: false,
                    targets: [0, 1]
                },
                {
                    searchable: true,
                    orderable: false,
                    targets: 2
                },
                {
                    render: function (data, type, row) {
                        var id = row[2];
                        return '<div class=CHK><input class="magic-radio" type="checkbox" id="' + id + '" value="' + id + '"><label for="' + id + '"></label></div>';
                    },
                    targets: 1
                }
            ]
            //order: [[2, 'asc']]
        });

        /* Column Index: order, search */
        table.on('order.dt search.dt', function () {
            table.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();

        setTimeout(function () {
            jQuery('#tableUser').show();
        }, 300);
    });
}