import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('registration');
  this.route('trainings', function() {
    this.route('edit', { path: "edit/:training_id" });
    this.route('new');
  });
  this.route('report');
  this.route("users", function(){
    this.route("edit", { path: "edit/:user_id" });
    this.route('appoint', { path: "appoint/:user_id" });
  });
  this.route('login');
  this.route('not-found', { path: '/*path' });
});

export default Router;
