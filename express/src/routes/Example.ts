import { Router } from "express";
import exampleController from "@controllers/Example";

const router = Router();

router.get("", async (req, res) => {
  await (exampleController as any).getAllExample(req, res);
});

router.get("/:id", async (req, res) => {
  await (exampleController as any).getExampleById(req, res);
});

export default router;
