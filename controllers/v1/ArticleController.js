import autoBind from 'auto-bind';
import BaseController from './BaseController';

class ArticleController extends BaseController {
  constructor() {
    super();
    autoBind(this);
  }

  getMe(res){
    const data = {};
    data.name = "Nwafor Daberechukwu Miracle";
    data.github = "@Dabby42";
    data.email = "nwafordabere@gmail.com";
    data.mobile = "08094911826";

    return super.validationSuccess(res, data, 'My Rule-Validation API');
  }

  validateRequest(req, res){
    try {
      // console.log(req.body.results);
      const {data} = req.body;
      const {field, condition, condition_value} = req.body.rule;
      const {result, nresult, firstKey, secondKey} = req.body.results;

      let field_value;

      if (secondKey) {
        field_value = data[firstKey][secondKey];
      } else {
        field_value = data[firstKey];
      }

      let ndata = {};

      if (result === false || nresult === false) {
        ndata.validation = {
          error: true,
          field,
          field_value,
          condition,
          condition_value
        }
        return super.validationFailed(res, ndata, `field ${field} failed validation.`)
      }

      ndata.validation = {
        error: false,
        field,
        field_value,
        condition,
        condition_value
      }

      return super.validationSuccess(res, ndata, `field ${field} successfully validated.`);

    } catch (error) {
      return super.validationFailed(res, null, `Invalid JSON payload passed.`)
    }
  } 


}

module.exports = ArticleController;
