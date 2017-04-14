import angular from 'angular';
import { ChangesDetectedComponent } from './changes-detected.component';
// import './changes-detected.less';

export default angular
    .module('theProtonApp.changes-detected', [])
    .component('changesDetected', ChangesDetectedComponent)
    .name;
