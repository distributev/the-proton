import angular from 'angular';
import { FeedbackModalComponent } from './feedback-modal.component';
// import './feedback-modal.less';

export default angular
    .module('theProtonApp.feedbackModal', [])
    .component('feedbackModal', FeedbackModalComponent)
    .name;