import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'name', label: 'Name' },
  { id: 'date', label: 'Date' },
  { id: 'service', label: 'Service' },
  { id: 'features', label: 'Features' },
  { id: 'complexity', label: 'Complexity' },
  { id: 'platforms', label: 'Platforms' },
  { id: 'users', label: 'Users' },
  { id: 'total', label: 'Total' },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
  undo: {
    color: theme.palette.common.white,
  },
  menu: {
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    '&.Mui-focusVisible': {
      backgroundColor: theme.palette.common.white,
    },
  },
  totalFilter: {
    fontSize: '2rem',
    // @ts-ignore
    color: theme.palette.common.orange,
  },
  dollarSign: {
    fontSize: '1.5rem',
    // @ts-ignore
    color: theme.palette.common.orange,
  },
}));

const EnhancedTableToolbar = ({
  rows,
  setRows,
  numSelected,
  selected,
  setSelected,
  filterPrice,
  setFilterPrice,
  totalFilter,
  setTotalFilter,
}) => {
  const classes = useToolbarStyles();
  const [undo, setUndo] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    color: '#FF3232',
    message: 'Row Deleted!',
  });

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
    setOpenMenu(true);
  };

  //   const handleClose = (e) => {
  //     setAnchorEl(null);
  //     setOpenMenu(false);
  //   };

  const onDelete = () => {
    const newRows = [...rows];
    const selectedRows = newRows.filter((row) => selected.includes(row.name));

    selectedRows.map((row) => (row.search = false));
    setRows(newRows);
    setUndo(selectedRows);
    setSelected([]);
    setAlert({ ...alert, open: true });
  };

  const onUndo = () => {
    setAlert({ ...alert, open: false });
    const newRows = [...rows];
    const redo = [...undo];
    redo.map((row) => (row.search = true));
    Array.prototype.push.apply(newRows, ...redo);
    setRows(newRows);
    // setRows(...newRows, ...redo); why the one above and not this one
  };

  const handleTotalFilter = (e) => {
    setFilterPrice(e.target.value);

    if (e.target.value !== '') {
      const newRows = [...rows];
      newRows.map((row) =>
        eval(
          ` ${e.target.value} ${
            totalFilter === '=' ? '===' : totalFilter
          } ${row.total.slice(1, row.total.length)}`
        )
          ? (row.search = true)
          : (row.search = false)
      );

      setRows(newRows);
    } else {
      const newRows = [...rows];
      newRows.map((row) => (row.search = true));
      setRows(newRows);
    }
  };

  const filterChange = (operator) => {
    if (filterPrice !== '') {
      const newRows = [...rows];
      newRows.map((row) =>
        eval(
          ` ${filterPrice} ${
            operator === '=' ? '===' : operator
          } ${row.total.slice(1, row.total.length)}`
        )
          ? (row.search = true)
          : (row.search = false)
      );

      setRows(newRows);
    }
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {null}
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={onDelete}>
            <DeleteIcon style={{ fontSize: 30 }} color="primary" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list" onClick={handleClick}>
            <FilterListIcon style={{ fontSize: 50 }} color="secondary" />
          </IconButton>
        </Tooltip>
      )}

      <Snackbar
        open={alert.open}
        message={alert.message}
        ContentProps={{
          style: {
            backgroundColor: alert.color,
          },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={(event, reason) => {
          if (reason === 'clickaway') {
            setAlert({ ...alert, open: false });
            const newRows = [...rows];
            const names = [...undo.map((row) => row.name)];
            setRows(newRows.filter((row) => !names.includes(row.name)));
          }
        }}
        action={
          <Button className={classes.undo} onClick={onUndo}>
            Undo
          </Button>
        }
      />

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={openMenu}
        elevation={0}
        style={{ zIndex: 1302 }}
        keepMounted
      >
        <MenuItem classes={{ root: classes.menu }}>
          <TextField
            type="number"
            placeholder="Enter a price to filter"
            value={filterPrice}
            onChange={handleTotalFilter}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span className={classes.dollarSign}>$</span>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    disableTouchRipple
                    onClick={() => {
                      setTotalFilter(
                        totalFilter === '>'
                          ? '<'
                          : totalFilter === '<'
                          ? '='
                          : '>'
                      );
                      filterChange(
                        totalFilter === '>'
                          ? '<'
                          : totalFilter === '<'
                          ? '='
                          : '>'
                      );
                    }}
                  >
                    <span className={classes.totalFilter}>{totalFilter}</span>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </MenuItem>
      </Menu>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  chip: {
    marginRight: '2em',
    // @ts-ignore
    backgroundColor: theme.palette.common.blue,
    color: theme.palette.common.white,
  },
}));

export default function EnhancedTable({
  rows,
  setRows,
  page,
  setPage,
  websiteChecked,
  iOSChecked,
  androidChecked,
  softwareChecked,
}) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterPrice, setFilterPrice] = useState('');
  const [totalFilter, setTotalFilter] = useState('>');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const switchFilters = () => {
    const websites = rows.filter((row) =>
      websiteChecked ? row.service === 'Website' : null
    );

    const iOSApps = rows.filter((row) =>
      iOSChecked ? row.platforms.includes('iOS') : null
    );

    const androidApps = rows.filter((row) =>
      androidChecked ? row.platforms.includes('Android') : null
    );

    const softwareApps = rows.filter((row) =>
      softwareChecked ? row.service === 'Custom Software' : null
    );

    if (!websiteChecked && !iOSChecked && !androidChecked && !softwareChecked) {
      return rows;
    } else {
      let newRows = websites.concat(
        iOSApps.filter((item) => websites.indexOf(item) < 0)
      );
      let newRows2 = newRows.concat(
        androidApps.filter((item) => newRows.indexOf(item) < 0)
      );
      let newRows3 = newRows2.concat(
        softwareApps.filter((item) => newRows2.indexOf(item) < 0)
      );
      return newRows3;
    }
  };

  const priceFilters = (switchRows) => {
    if (filterPrice !== '') {
      const newRows = [...switchRows];
      newRows.map((row) =>
        eval(
          ` ${filterPrice} ${
            totalFilter === '=' ? '===' : totalFilter
          } ${row.total.slice(1, row.total.length)}`
        )
          ? row.search === false
            ? null
            : (row.search = true)
          : (row.search = false)
      );

      return newRows;
    } else {
      return switchRows;
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0}>
        <EnhancedTableToolbar
          rows={rows}
          setRows={setRows}
          selected={selected}
          setSelected={setSelected}
          numSelected={selected.length}
          filterPrice={filterPrice}
          setFilterPrice={setFilterPrice}
          totalFilter={totalFilter}
          setTotalFilter={setTotalFilter}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(
                priceFilters(switchFilters()).filter((row) => row.search),
                getComparator(order, orderBy)
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="center">{row.date}</TableCell>
                      <TableCell align="center">{row.service}</TableCell>
                      <TableCell align="center" style={{ width: '5em' }}>
                        {row.features}
                      </TableCell>
                      <TableCell align="center">{row.complexity}</TableCell>
                      <TableCell align="center">{row.platforms}</TableCell>
                      <TableCell align="center">{row.users}</TableCell>
                      <TableCell align="center">{row.total}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={
            priceFilters(switchFilters()).filter((row) => row.search).length
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <Grid container justify="flex-end">
          <Grid item>
            {filterPrice !== '' ? (
              <Chip
                onDelete={() => {
                  setFilterPrice('');
                  const newRows = [...rows];
                  newRows.map((row) => (row.search = true));
                  setRows(newRows);
                }}
                className={classes.chip}
                label={
                  totalFilter === '>'
                    ? `Less than $${filterPrice}`
                    : totalFilter === '<'
                    ? `Greater than $${filterPrice}`
                    : `Equal to $${filterPrice}`
                }
              />
            ) : null}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
