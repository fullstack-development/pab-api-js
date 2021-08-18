# pab-api-js

PAB API JavaScript wrapper


## Usage

```javascript
import { Pab } from 'pab-api-js';

const pab = new Pab('http://localhost:8080/');

const getReport = async () => {
  try {
    const res = await pab.getFullReport();
    console.log(res);
  } catch (err) {
    console.log(err);
  }  
};

getReport();
```
