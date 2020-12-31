import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddIcon from '@material-ui/icons/Add';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';

import EnhancedTable from '@ui/EnhancedTable';

const useStyles = makeStyles((theme) => ({
  service: {
    fontWeight: 300,
  },
  users: {
    marginRight: 0,
  },
  button: {
    color: theme.palette.common.white,
    // @ts-ignore
    backgroundColor: theme.palette.common.orange,
    borderRadius: 50,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
  },
}));

const createData = (
  name,
  date,
  service,
  features,
  complexity,
  platforms,
  users,
  total,
  search
) => ({
  name,
  date,
  service,
  features,
  complexity,
  platforms,
  users,
  total,
  search,
});

export default function ProjectManager() {
  const classes = useStyles();
  const theme = useTheme();

  const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));

  const [rows, setRows] = useState([
    createData(
      'Victor Aiyeola',
      '11/2/19',
      'Website',
      'E-commerce',
      'N/A',
      'N/A',
      'N/A',
      '$1500',
      true
    ),
    createData(
      'Bill Gates',
      '10/11/19',
      'Custom Software',
      'GPS, Push Notifications, Users/Authentication, File Transfer',
      'Medium',
      'Web Application',
      '0-10',
      '$1600',
      true
    ),
    createData(
      'Steve Jobs',
      '2/13/19',
      'Mobile App',
      ' Users/Authentication, Photo/Video, File Transfer',
      'Low',
      'iOS, Android',
      '10-100',
      '$1250',
      true
    ),
    createData(
      'Allen Jobs',
      '2/13/19',
      'Mobile App',
      ' Users/Authentication, Photo/Video, File Transfer',
      'Low',
      'Android',
      '10-100',
      '$1250',
      true
    ),
    createData(
      'Barry Flash',
      '2/13/19',
      'Custom Software',
      ' Users/Authentication, Photo/Video, File Transfer',
      'Low',
      'Web Application',
      '10-100',
      '$1250',
      true
    ),
  ]);

  const platformOptions = ['Web', 'iOS', 'Android'];
  let featureOptions = [
    'Photo/Video',
    'GPS',
    'File Transfer',
    'Users/Authentication',
    'Biometrics',
    'Push Notifications',
  ];
  let websiteOptions = ['Basic', ' Interactive', 'E-Commerce'];

  const [websiteChecked, setWebsiteChecked] = useState(false);
  const [iOSChecked, setIOSChecked] = useState(false);
  const [androidChecked, setAndroidChecked] = useState(false);
  const [softwareChecked, setSoftwareChecked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [total, setTotal] = useState('');
  const [service, setService] = useState('');
  const [complexity, setComplexity] = useState('');
  const [users, setUsers] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [features, setFeatures] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const addProject = () => {
    setRows([
      ...rows,
      createData(
        name,
        format(date, 'MM/dd/yy'),
        service,
        features.join(', '),
        service === 'Website' ? 'N/A' : complexity,
        service === 'Website' ? 'N/A' : platforms.join(', '),
        service === 'Website' ? 'N/A' : users,
        `$${total}`,
        true
      ),
    ]);

    setDialogOpen(false);
    setName('');
    setDate(new Date());
    setService('');
    setFeatures([]);
    setComplexity('');
    setPlatforms([]);
    setUsers('');
    setTotal('');
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);

    const rowData = rows.map((row) =>
      Object.values(row).filter((option) => option !== true && option !== false)
    );

    const matches = rowData.map((row) =>
      row.map((option) =>
        option.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );

    const newRows = [...rows];

    matches.map((row, index) =>
      row.includes(true)
        ? (newRows[index].search = true)
        : (newRows[index].search = false)
    );

    setRows(newRows);
    setPage(0);
  };

  const serviceQuestions = (
    <>
      <Grid item style={{ marginTop: matchesSM ? 20 : null }}>
        <Typography variant="h4">Service</Typography>
      </Grid>
      <Grid item>
        <RadioGroup
          aria-label="service"
          name="service"
          value={service}
          onChange={(e) => {
            setService(e.target.value);
            setFeatures([]);
          }}
        >
          <FormControlLabel
            classes={{ label: classes.service }}
            value="Website"
            label="Website"
            control={<Radio />}
          />
          <FormControlLabel
            classes={{ label: classes.service }}
            value="Mobile App"
            label="Mobile App"
            control={<Radio />}
          />
          <FormControlLabel
            classes={{ label: classes.service }}
            value="Custom Software"
            label="Custom Software"
            control={<Radio />}
          />
        </RadioGroup>
      </Grid>
    </>
  );

  const complexityQuestions = (
    <Grid item style={{ marginBottom: matchesSM ? 50 : null }}>
      <Grid
        item
        container
        direction="column"
        style={{ marginTop: matchesSM ? 50 : '5em' }}
        alignItems={matchesSM ? 'center' : undefined}
      >
        <Grid item>
          <Typography variant="h4">Complexity</Typography>
        </Grid>
        <Grid item>
          <RadioGroup
            aria-label="complexity"
            name="complexity"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
          >
            <FormControlLabel
              disabled={service === 'Website'}
              classes={{ label: classes.service }}
              value="Low"
              label="Low"
              control={<Radio />}
            />
            <FormControlLabel
              disabled={service === 'Website'}
              classes={{ label: classes.service }}
              value="Medium"
              label="Medium"
              control={<Radio />}
            />
            <FormControlLabel
              disabled={service === 'Website'}
              classes={{ label: classes.service }}
              value="High"
              label="High"
              control={<Radio />}
            />
          </RadioGroup>
        </Grid>
      </Grid>
    </Grid>
  );

  const userQuestions = (
    <Grid
      item
      container
      direction="column"
      alignItems={matchesSM ? 'center' : undefined}
      style={{ marginTop: matchesSM ? 50 : '5em' }}
    >
      <Grid item>
        <Typography variant="h4">Users</Typography>
      </Grid>
      <Grid item>
        <RadioGroup
          aria-label="users"
          name="users"
          value={users}
          onChange={(e) => setUsers(e.target.value)}
        >
          <FormControlLabel
            disabled={service === 'Website'}
            classes={{
              label: classes.service,
              root: classes.users,
            }}
            value="0-10"
            label="0-10"
            control={<Radio />}
          />
          <FormControlLabel
            disabled={service === 'Website'}
            classes={{
              label: classes.service,
              root: classes.users,
            }}
            value="10-100"
            label="10-100"
            control={<Radio />}
          />
          <FormControlLabel
            disabled={service === 'Website'}
            classes={{
              label: classes.service,
              root: classes.users,
            }}
            value="100+"
            label="100+"
            control={<Radio />}
          />
        </RadioGroup>
      </Grid>
    </Grid>
  );

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid
        container
        direction="column"
        alignItems={matchesSM ? 'center' : undefined}
      >
        <Grid
          item
          style={{ marginTop: '2em', marginLeft: matchesSM ? 0 : '5em' }}
        >
          <Typography variant="h1">Projects</Typography>
        </Grid>
        <Grid item>
          <TextField
            placeholder="Search project details or create a new entry."
            style={{
              width: matchesSM ? '25em' : '35em',
              marginLeft: matchesSM ? 0 : '5em',
            }}
            value={search}
            onChange={handleSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setDialogOpen(true)}>
                    <AddIcon color="primary" style={{ fontSize: 30 }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid
          item
          style={{ marginLeft: matchesSM ? 0 : '5em', marginTop: '2em' }}
        >
          <FormGroup row>
            <Grid
              container
              direction={matchesSM ? 'column' : 'row'}
              justify={matchesSM ? 'center' : undefined}
            >
              <Grid item>
                <FormControlLabel
                  style={{ marginRight: matchesSM ? 0 : '5em' }}
                  control={
                    <Switch
                      checked={websiteChecked}
                      color="primary"
                      onChange={() => setWebsiteChecked(!websiteChecked)}
                    />
                  }
                  label="Websites"
                  labelPlacement={matchesSM ? 'end' : 'start'}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  style={{ marginRight: matchesSM ? 0 : '5em' }}
                  control={
                    <Switch
                      checked={iOSChecked}
                      color="primary"
                      onChange={() => setIOSChecked(!iOSChecked)}
                    />
                  }
                  label="iOS Apps"
                  labelPlacement={matchesSM ? 'end' : 'start'}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  style={{ marginRight: matchesSM ? 0 : '5em' }}
                  control={
                    <Switch
                      checked={androidChecked}
                      color="primary"
                      onChange={() => setAndroidChecked(!androidChecked)}
                    />
                  }
                  label="Android Apps"
                  labelPlacement={matchesSM ? 'end' : 'start'}
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={softwareChecked}
                      color="primary"
                      onChange={() => setSoftwareChecked(!softwareChecked)}
                    />
                  }
                  label="Custom Software"
                  labelPlacement={matchesSM ? 'end' : 'start'}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Grid>

        <Grid
          item
          style={{
            marginTop: '5em',
            maxWidth: '100%',
            marginBottom: matchesMD ? '40em' : '35em',
          }}
        >
          <EnhancedTable
            rows={rows}
            setRows={setRows}
            page={page}
            setPage={setPage}
            websiteChecked={websiteChecked}
            iOSChecked={iOSChecked}
            androidChecked={androidChecked}
            softwareChecked={softwareChecked}
          />
        </Grid>

        <Dialog
          fullWidth
          fullScreen={matchesSM}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          scroll="body"
          style={{ zIndex: 1302 }}
          maxWidth="md"
        >
          <Grid container justify="center">
            <Grid item>
              <Typography variant="h1" gutterBottom>
                Add a new project
              </Typography>
            </Grid>
          </Grid>
          <DialogContent>
            <Grid
              container
              justify="space-between"
              direction={matchesSM ? 'column' : 'row'}
              alignItems={matchesSM ? 'center' : undefined}
            >
              <Grid item>
                <Grid
                  item
                  container
                  direction="column"
                  sm
                  alignItems={matchesSM ? 'center' : undefined}
                >
                  <Hidden mdUp>{serviceQuestions}</Hidden>
                  <Hidden mdUp>{userQuestions}</Hidden>
                  <Hidden mdUp>{complexityQuestions}</Hidden>
                  <Grid item>
                    <TextField
                      fullWidth={!matchesSM}
                      label="Name"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ width: matchesSM ? 250 : undefined }}
                    />
                  </Grid>
                  <Grid
                    item
                    container
                    direction="column"
                    alignItems={matchesSM ? 'center' : undefined}
                    style={{ marginTop: matchesSM ? 50 : '5em' }}
                  >
                    <Hidden smDown>{serviceQuestions}</Hidden>
                    <Grid item style={{ marginTop: matchesSM ? 0 : '5em' }}>
                      <Select
                        style={{ width: matchesSM ? 250 : '12em' }}
                        MenuProps={{
                          style: { zIndex: 1303 },
                        }}
                        disabled={service === 'Website'}
                        labelId="platforms"
                        id="platforms"
                        multiple
                        displayEmpty
                        renderValue={
                          platforms.length > 0 ? undefined : () => 'Platforms'
                        }
                        value={platforms}
                        // @ts-ignore
                        onChange={(e) => setPlatforms(e.target.value)}
                      >
                        {platformOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid
                  item
                  container
                  direction="column"
                  sm
                  style={{ marginTop: 16 }}
                >
                  <Grid
                    item
                    style={{
                      marginTop: matchesSM ? 50 : null,
                      width: matchesSM ? 250 : undefined,
                    }}
                  >
                    <KeyboardDatePicker
                      DialogProps={{
                        style: { zIndex: 1303 },
                      }}
                      format="MM/dd/yyyy"
                      value={date}
                      onChange={(newDate) => setDate(newDate)}
                    />
                  </Grid>

                  <Hidden smDown>{complexityQuestions}</Hidden>
                </Grid>
              </Grid>

              <Grid item>
                <Grid
                  item
                  container
                  direction="column"
                  sm
                  alignItems={matchesSM ? 'center' : undefined}
                >
                  <Grid item style={{ marginTop: matchesSM ? 50 : null }}>
                    <TextField
                      label="Total"
                      id="total"
                      value={total}
                      style={{ width: matchesSM ? 250 : undefined }}
                      onChange={(e) => setTotal(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    style={{ alignSelf: matchesSM ? 'center' : 'flex-end' }}
                  >
                    <Hidden smDown>{userQuestions}</Hidden>
                  </Grid>
                  <Grid item style={{ marginTop: matchesSM ? 50 : '5em' }}>
                    <Select
                      style={{ width: matchesSM ? 250 : '12em' }}
                      MenuProps={{
                        style: { zIndex: 1303 },
                      }}
                      labelId="features"
                      id="features"
                      multiple
                      displayEmpty
                      renderValue={
                        features.length > 0 ? undefined : () => 'Features'
                      }
                      value={features}
                      // @ts-ignore
                      onChange={(e) => setFeatures(e.target.value)}
                    >
                      {service === 'Website'
                        ? (featureOptions = websiteOptions)
                        : null}
                      {featureOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container justify="center" style={{ marginTop: '3em' }}>
              <Grid item>
                <Button
                  color="primary"
                  style={{ fontWeight: 300 }}
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={addProject}
                  disabled={
                    service === 'Website'
                      ? name.length === 0 ||
                        total.length === 0 ||
                        features.length === 0 ||
                        features.length > 1
                      : name.length === 0 ||
                        total.length === 0 ||
                        features.length === 0 ||
                        users.length === 0 ||
                        complexity.length === 0 ||
                        platforms.length === 0 ||
                        service.length === 0
                  }
                >
                  Add Project +
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
