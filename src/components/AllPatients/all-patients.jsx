/* eslint-disable react/forbid-prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cx from 'classnames';

import CardList from '../CardList/card-list';
import styles from './all-patients.css';
import cdsExecution from '../../middleware/cds-execution';

const propTypes = {
  patients: PropTypes.array.isRequired,
  /**
   * Flag to determine if the CDS Developer Panel is displayed or not
   */
  isContextVisible: PropTypes.bool.isRequired,
};

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
                <td>{patient.name}</td>
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

export default connect(mapStateToProps)(AllPatients);

// /* eslint-disable react/forbid-prop-types */

// import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import cx from 'classnames';

// import CardList from '../CardList/card-list';
// import styles from './all-patients.css';
// import cdsExecution from '../../middleware/cds-execution';

// const propTypes = {
//   /**
//    * The Patient resource in context
//    */
//   patient: PropTypes.object,
//   /**
//    * Flag to determine if the CDS Developer Panel is displayed or not
//    */
//   isContextVisible: PropTypes.bool.isRequired,
// };

// cdsExecution.registerTriggerHandler('face-sheet/patient-view', {
//   needExplicitTrigger: false,
//   onSystemActions: () => { },
//   onMessage: () => { },
//   generateContext: () => ({ }), // no special context
// });

// /**
//  * Left-hand side on the mock-EHR view that displays the cards and relevant UI for the patient-view hook
//  */
// export const PatientView = (props) => {
//   const name = props.patient.name || 'Missing Name';
//   const dob = props.patient.birthDate || 'Missing DOB';
//   const pid = props.patient.id || 'Missing Patient ID';

//   const isHalfView = props.isContextVisible ? styles['half-view'] : '';

//   return (
//     <div className={cx(styles['patient-view'], isHalfView)}>
//       <h1 className={styles['view-title']}>Patient View</h1>
//       <h2>{name}</h2>
//       <div className={styles['patient-data-text']}>
//         <p>
//           <strong>ID: </strong>
//           {' '}
//           {pid}
//           {' '}
//           <strong>Birthdate: </strong>
//           {' '}
//           {dob}
//         </p>
//       </div>
//       <CardList
//         takeSuggestion={() => { }}
//       />
//     </div>
//   );
// };

// PatientView.propTypes = propTypes;

// const mapStateToProps = (state) => ({
//   isContextVisible: state.hookState.isContextVisible,
//   patient: state.patientState.currentPatient,
// });

// export default connect(mapStateToProps)(PatientView);
