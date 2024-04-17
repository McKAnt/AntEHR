/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';

import CardList from '../CardList/card-list';
import styles from './all-patients.css';
import cdsExecution from '../../middleware/cds-execution';
import retrievePatient from '../../retrieve-data-helpers/patient-retrieval'
import { setHook } from '../../actions/hook-actions'

const propTypes = {
  patients: PropTypes.array.isRequired,
  /**
   * Flag to determine if the CDS Developer Panel is displayed or not
   */
  isContextVisible: PropTypes.bool.isRequired,
  /**
   * Function to set a hook in the store (i.e. 'all-patients' to 'patient-view')
   */
  setHook: PropTypes.func.isRequired,
};

async function switchToPatient(patientId, setHook) {
  try {
    await retrievePatient(patientId);
    setHook('patient-view');
  } catch (err) {
    console.error(err);
    // this.setState({ isChangePatientOpen: true });
    // if (this.state.settingsOpen) { this.closeSettingsMenu(); }
  }
  return false;
}

/**
 * Left-hand side on the mock-EHR view that displays the cards and relevant UI for the patient-view hook
 */
export const AllPatients = (props) => {
  const isHalfView = props.isContextVisible ? styles['half-view'] : '';
  const patients = props.patients
    .map(entry => entry.resource)
    .map(resource => {
      return {
        id: resource.id,
        name: `${resource.name[0].family[0]}, ${resource.name[0].given[0]}`
      }
  }).sort((a, b) => {
    return a.name.localeCompare(b.name);
  }).filter(patient => patient.name != 'Jackson, Brenda'); // long id
  return (
    <div className={cx(styles['all-patients'], isHalfView)}>
      <h1 className={styles['view-title']}>All Patients</h1>
      <table className={styles['all-patients-table']}>
        <thead>
          <th>MRN</th>
          <th>Name</th>
        </thead>
        <tbody>
          {patients.map(patient => {
            return (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>
                  <a
                    href="javascript: void(0)"
                    onClick={() => switchToPatient(patient.id, props.setHook)}
                  >
                    {patient.name}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

AllPatients.propTypes = propTypes;

const mapStateToProps = (state) => ({
  isContextVisible: state.hookState.isContextVisible,
  patients: state.fhirServerState.allPatients
});

const mapDispatchToProps = (dispatch) => ({
  setHook: (hook, screen) => {
    dispatch(setHook(hook, screen));
  },
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(AllPatients);
