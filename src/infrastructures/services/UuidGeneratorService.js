import { v7 as uuidv7 } from 'uuid';
import IdGeneratorService from "../../applications/interfaces/IdGeneratorService.js";

class UuidGeneratorService extends IdGeneratorService {
  constructor() {
    super();
  }

  generate() {
      return uuidv7();
  }
}

export default UuidGeneratorService;