import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
  authorize(sessionData, block) {
      block('Authorization', 'Bearer ' + sessionData.access_token);
  }
});
