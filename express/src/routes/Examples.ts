import { Router } from "express";
import examples from "@controllers/Examples";

const router: Router = Router();

router.post("/test", examples.postTest);
router.get("", examples.getAllExample);
router.get("/:id", examples.getExampleById);

export default router;
