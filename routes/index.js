const { Router } = require("express");
const shiftController = require("../controllers/shiftController");
const skillsController = require("../controllers/skillsController");
const groupSkillsController = require("../controllers/groupSkillsController");
const poolController = require("../controllers/poolController");
const typeController = require("../controllers/typeController");
const userController = require("../controllers/userController");
const userSkillsController = require("../controllers/userSkillsController");
const affectationController = require("../controllers/affectationController");
const skillsBelongsToGroupSkillsController = require("../controllers/skillsBelongsToGroupSkillsController");
const shiftSkillsController = require("../controllers/shiftSkillsController");
const authController = require("../controllers/authController");
const router = Router();
router.get("/Shifts", shiftController.getAllShifts);
router.get("/Skills", skillsController.getAllSkills);
router.get("/groupSkills", groupSkillsController.getAllGroupSkills);
router.get("/groupSkillsWithPagination", groupSkillsController.getAllGroupSkillsWithPagination);
router.get("/Pools", poolController.getAllPools);
router.get("/Types", typeController.getAllTypes);
router.get("/typeWithPagination",typeController.getAllTypeWithPagination);
router.get("/users", userController.getAllUsers);
router.get("/affectation", affectationController.getAllShiftUser);
router.get("/userSkills", userSkillsController.getSkillsByUser);
router.post("/bestSuggestion", userSkillsController.getBestSuggestion);
router.get("/freeUser", userController.getFreeUser);
router.get("/workedUser",userController.getWorkedUser);
router.get("/usersWithPagination",userController.getAllUsersWithPagination);
router.get("/shiftsByUser/:userId",shiftController.getShiftsByUser);
router.get("/Shifts/:shiftId", shiftController.getShiftById);
router.get("/DayOffShift/:shiftId",shiftController.getDayOffShift)
router.get("/Skills/:skillId", skillsController.getSkillById);
router.get("/users/:userId", userController.getUserById);
router.post("/auth/login", authController.login);
router.get("/Pool/:poolId", poolController.getPoolById);
router.get("/Types/:typeId", typeController.getTypeById);
router.get("/shiftSkills/:shiftId", shiftSkillsController.getSkillsByShift);
router.patch("/shiftSkills/:shiftId", shiftSkillsController.updateShiftSkill);

router.post("/shifts", shiftController.createShift);
router.post("/dayOff",shiftController.createDayOff);
router.post("/skills", skillsController.createSkills);
router.post("/groupSkills", groupSkillsController.createGroupSkills);
router.post("/types", typeController.createType);
router.post("/pool", poolController.createPool);
router.post("/users", userController.createUser);
router.post("/addSkillUser", userController.addSkillToUser);
router.post("/addSkillToGroupSkill", groupSkillsController.addSkillToGroupSkills);
router.post("/affectUserToShift", shiftController.affectUserToShift);
router.post("/affectUserToPool", poolController.addMemberToPool);
router.post("/usersWithSkills",userController.getUserBySkills);

router.delete("/shifts/:id", shiftController.deleteShift);
router.delete("/skills/:id", skillsController.deleteSkill);
router.delete("/groupSkills/:id", groupSkillsController.deleteGroupSkills);
router.delete("/pool/:id", poolController.deletePool);
router.delete("/type/:id", typeController.deleteType);
router.delete("/user/:userId", userController.deleteUser);
router.delete(
  "/affectation/:shiftId/:userId",
  affectationController.deleteAffectation
);

router.delete(
  "/userSkills/:skillId/:userId",
  userSkillsController.deleteSkillFromUser
);

router.put("/shifts/:shiftId", shiftController.updateShift);
router.put( "/groupSkills/:groupSkillId", groupSkillsController.updateGroupSkill
);
router.put("/skills/:skillId", skillsController.updateSkill);
router.put("/pool/:PoolId", poolController.updatePool);
router.put("/types/:typeId", typeController.updateType);
router.put("/users/:userId", userController.updateUser);
module.exports = router;
