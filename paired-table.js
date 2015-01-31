// dead simple integration of a sorting table in react to an existing application
// add and copy&paste: <script src="http://fb.me/react-0.12.2.min.js"></script>

window.mountReactTable = (function () {
  var clickyStyle = {cursor: "pointer", textDecoration: 'underline'};

  var Description = React.createClass({
    render: function () {
      return React.createElement(
        'tr',
        null,
        React.createElement(
          'td',
          {
            colSpan: this.props.colSpan
          },
          this.props.description
        )
      );
    }
  });

  var Pair = React.createClass({
    // mixins: [PureRenderMixin] for better perf
    // ...comes with some special conditions
    // see: http://qiita.com/kimagure/items/c38444713ea48a6f02e8
    render: function () {
      var pair = this.props.pair;
      var expandLabel = this.props.expandLabel;
      var handleExpand = this.props.handleExpand;
      var columns = this.props.columns.map(function (column) {
        return React.createElement(
          'td',
          {
            key: column.id
          },
          pair[column.id]
        );
      });
      columns.push(React.createElement(
        'td',
        {
          key: 'expand',
          style: clickyStyle,
          onClick: handleExpand
        },
        expandLabel
      ));
      return React.createElement(
        'tr',
        null,
        columns
      );
    }
  });

  var Tbody = React.createClass({
    render: function () {
      var getHandleExpand = this.props.getHandleExpand;
      var expandedPair = this.props.expandedPair;
      var columns = this.props.columns;
      var rows = [];
      this.props.pairs.forEach(function (pair) {
        var handleExpand = getHandleExpand(pair.id);
        var pairExpanded = expandedPair === pair.id;
        var expandLabel;
        if (pairExpanded) {
          expandLabel = 'col';
        } else {
          expandLabel = 'exp';
        }
        rows.push(React.createElement(
          Pair,
          {
            key: pair.id,
            pair: pair,
            columns: columns,
            expandLabel: expandLabel,
            handleExpand: handleExpand
          }
        ));
        if (pairExpanded) {
          rows.push(React.createElement(
            Description,
            {
              key: pair.id + '-description',
              colSpan: columns.length + 1,
              description: pair.description
            }
          ));
        }
      });
      return React.createElement(
        'tbody',
        null,
        rows
      );
    }
  });

  var Thead = React.createClass({
    render: function () {
      var sort = this.props.sort;
      var columns = this.props.columns;
      var getHandleSortByHeader = this.props.getHandleSortByHeader;
      var headers = columns.map(function (column) {
        var label = column.name;
        if (sort.id === column.id) {
          if (sort.direction === 1) {
            label += " ↑";
          } else {
            label += " ↓";
          }
        }
        return React.createElement(
          'th',
          {
            key: column.id,
            style: clickyStyle,
            onClick: getHandleSortByHeader(column.id)
          },
          label
        );
      });
      return React.createElement(
        'thead',
        null,
        headers
      );
    }
  });

  var Table = React.createClass({
    render: function () {
      return React.createElement(
        'table',
        null,
        React.createElement(
          Thead,
          this.props
        ),
        React.createElement(
          Tbody,
          this.props
        )
      );
    }
  });

  var applySorting = function () {
    var sort = tableProps.sort;
    if (!sort.id) {
      return;
    }
    var newPairs = tableProps.pairs.slice();
    newPairs.sort(function (a, b) {
      var aProp = a[sort.id];
      var bProp = b[sort.id];
      var comparison = aProp > bProp;
      return (sort.direction === 1) ? comparison : !comparison;
    });
    tableProps.pairs = newPairs;
    renderTable();
  };

  var getHandleSortByHeader = function (columnId) {
    return function () {
      var sort = tableProps.sort;
      if (sort.id === columnId && sort.direction !== null) {
        sort.direction = (sort.direction === 1) ? 0 : 1;
      } else {
        sort.id = columnId;
        sort.direction = 1;
      }
      applySorting();
    };
  };

  var getHandleExpand = function (rowId) {
    return function () {
      tableProps.expandedPair = (tableProps.expandedPair === rowId) ? null : rowId;
      renderTable();
    };
  };

  var tableProps = {
    columns: [],
    pairs: [],
    sort: {
      id: null,
      direction: null
    },
    expandedPair: null,
    getHandleSortByHeader: getHandleSortByHeader,
    getHandleExpand: getHandleExpand
  };

  var renderTable;

  return function (container, initialTableProps) {
    tableProps.columns = initialTableProps.columns;
    tableProps.pairs = initialTableProps.pairs;

    renderTable = function () {
      React.render(
        React.createElement(
          Table,
          tableProps
      ),
      container
      );
    };
    renderTable();
  };
})();

// or $(function () {}) with jQuery
document.addEventListener("DOMContentLoaded", function() {
  // feed the content here with your template as needed
  mountReactTable(
    document.body,
    {
      columns: [{
        id: 'key1',
        name: 'fruit'
      }, {
        id: 'key2',
        name: 'color'
      }],
      pairs:[{
        id: 1,
        key1: 'apple',
        key2: 'red',
        description: 'apples are red'
      }, {
        id: 2,
        key1: 'banana',
        key2: 'yellow',
        description: 'bananas are yellow'
      }, {
        id: 3,
        key1: 'grape',
        key2: 'green',
        description: 'grapes are green or purple'
      }]
    }
  );
});
