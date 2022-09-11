const db = require("./utils/initializeDataBase");
const fetch = require("cross-fetch");
function main() {
  fetch("http://localhost:4000/api/user/getAllUsers?page=0&size=86")
    .then((res) => res.json())
    .then((res) => {
      res.data.map(async (user) => {
        await db.user.create({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          microsoftId: user.microsoftId,
          idMonitoring: user._id,
        });
      });
    });
}

main();
