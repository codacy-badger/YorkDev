'use strict';
require('isomorphic-fetch');
/*global fetch*/
const API = {
  HOST: 'https://api.patreon.com',
  PATH: 'oauth2/api',
};


/* Some reason gender returns 0, and apparently cannot be set??
class Gender {
  constructor(value) { //Supossing 0 = neutral, 1 = male, 2 = female
    this.value = value;
  }

  isMale() {
    return this.value == 1;
  }

  isFemale() {
    return this.value == 2;
  }

  isNeutral() {
    return this.value == 0;
  }

  isDefined() {
    return !this.isNeutral();
  }
}
*/
class User {
  constructor(data) {
    this.id = data.id;
    this.firstName = data.attributes.first_name;
    this.lastName = data.attributes.last_name;
    this.fullName = data.attributes.full_name;
    // this.gender = new Gender(data.attributes.gender);
    this.vanity = data.attributes.vanity;
    this.about = data.attributes.about;
    this.facebookId = data.attributes.facebook_id;
    this.image = data.attributes.image_url;
    this.thumbnail = data.attributes.thumb_url;
    this.youtube = data.attributes.youtube;
    this.twitter = data.attributes.twitter;
    this.facebook = data.attributes.facebook;
    this.suspended = data.attributes.is_suspended;
    this.deleted = data.attributes.is_deleted;
    this.nuked = data.attributes.is_nuked;
    this.created = data.attributes.created;
    this.patreonPage = data.attributes.url;
    this.campaign = data.relationships.campaigns;
  }
}

class Campaign {
  constructor(data, patron) {
    try {
      this.id = data.id;

      this.Endpoints = {};
      this.Endpoints.PLEDGES = `${API.HOST}/${API.PATH}/campaigns/${this.id}/pledges`;

      this.patron = patron;
      // Attributes.
      this.summary = data.attributes.summary;
      this.name = data.attributes.creation_name;
      this.payPer = data.attributes.pay_per_name;
      this.oneLiner = data.attributes.one_liner;
      this.mainVidEmbed = data.attributes.main_video_embed;
      this.mainVidLink = data.attributes.main_video_url;
      this.imgSmallLink = data.attributes.image_small_url;
      this.imgLink = data.attributes.image_url;
      this.thanksVidLink = data.attributes.thanks_video_url;
      this.thanksVidEmbed = data.attributes.thanks_video_embed;
      this.thanksMsg = data.attributes.thanks_msg;
      this.monthly = data.attributes.is_monthly;
      this.nsfw = data.attributes.is_nsfw;
      this.createdAt = data.attributes.created_at;
      this.publishedAt = data.attributes.published_at;
      this.pledgeLink = data.attributes.pledge_url;
      this.pledgeCost = data.attributes.pledge_sum;
      this.patronsCount = data.attributes.patron_count;
      this.creationsCount = data.attributes.creation_count;
      this.outstandingBalance = data.attributes.outstanding_payment_amount_cents;
      // Relationships.
      this.creator = data.relationships.creator;
      this.rewards = data.relationships.rewards;
      this.goals = data.relationships.goals;
      this.pledges = data.relationships.pledges;
    } catch (e) {
      console.log(e);
    }
  }

  getPledges(options) {
    return new Promise((fulfill, reject) => {
      this.patron.makeRequest(this.Endpoints.PLEDGES, options).then((res => {
        res.json().then(body => {
          let pledges = [];
          if (body.data && body.data.length)
            for (let data of body.data) {
              pledges.push(new Pledge(data));
            }
          fulfill(pledges);
        }).catch(reject);
      })).catch(reject);
    });
  }
}

class Pledge { // Work in progress...
  constructor(data) {
    try {
      this.id = data.id;
      this.amountCents = data.attributes.amount_cents;
      this.createdAt = data.attributes.created_at;
      this.pledgeCapCents = data.attributes.pledge_cap_cents;
      this.patronFees = data.attributes.patron_pays_fees;
      this.patron = data.relationships.patron;
      this.reward = data.relationships.reward;
      this.creator = data.relationships.creator;
      this.address = data.relationships.address;
      this.card = data.relationships.card;
      this.pledgeVAT = data.relationships.pledge_vat_location;
    } catch (e) {
      console.log(e);
    }
  }
}

class Patron {
  constructor(access_token) {
    this.Endpoints = {};
    this.Endpoints.CURRENT_USER = `${API.HOST}/${API.PATH}/current_user`;
    this.Endpoints.CURRENT_USER_CAMPAIGNS = `${this.Endpoints.CURRENT_USER}/campaigns`;
    this.accessToken = access_token;
  }

  /*eslint-disable*/
  getCurrentUser(options) {
    /*eslint-enable*/
    return new Promise((fulfill, reject) => {
      this.makeRequest(this.Endpoints.CURRENT_USER).then((res) => {
        res.json().then((body) => { // Way so lazy to make this look better xD
          fulfill(new User(body.data));
        }).catch(reject);
      }).catch(reject);
    });
  }

  /*eslint-disable*/
  getCurrentUserCampaigns(options) {
    /*eslint-enable*/
    return new Promise((fulfill, reject) => {
      this.makeRequest(this.Endpoints.CURRENT_USER_CAMPAIGNS).then((res) => {
        res.json().then((body) => {
          let campaigns = [];
          if (body.data && body.data.length) {
            for (let data of body.data) {
              campaigns.push(new Campaign(data, this));
            }
          }
          fulfill(campaigns);
        }).catch(reject);
      }).catch(reject);
    });
  }

  makeRequest(uri, options) {
    return fetch(uri, {
      options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      },
      credentials: 'include'
    });
  }
}

module.exports = Patron;
