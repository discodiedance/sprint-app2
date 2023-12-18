import { body, param } from "express-validator";
import { inputModelValidation } from "../inputModel/input-model-validation";
import { QueryBlogRepository } from "../../repositories/query-repository/query-blog-repository";
import notFoundValidation from "../inputModel/not-found-validation";

export const blogIdInParamsValidation = param("blogId")
  .isString()
  .trim()
  .custom(async (value) => {
    const blog = await QueryBlogRepository.getBlogById(value);

    if (!blog) {
      throw new Error("Incorrect blogId!");
    }
  })
  .withMessage("Incorrect blogId!");

export const blogIdInBodyValidation = body("blogId")
  .isString()
  .trim()
  .custom(async (value, meta) => {
    const blog = await QueryBlogRepository.getBlogById(value);

    if (!blog) {
      throw new Error("Incorrect blogId!");
    }
    meta.req.blog = blog;
  })
  .withMessage("Incorrect blogId!");

const titleValidation = body("title")
  .isString()
  .trim()
  .isLength({ min: 5, max: 30 })
  .withMessage("Incorrect title!");

const shortDescriptionValidation = body("shortDescription")
  .isString()
  .trim()
  .isLength({ min: 5, max: 100 })
  .withMessage("Incorrect short description!");

const contentValidatorValidation = body("content")
  .isString()
  .trim()
  .isLength({ min: 5, max: 1000 })
  .withMessage("Incorrect content!");

export const postValidation = () => [
  titleValidation,
  shortDescriptionValidation,
  contentValidatorValidation,
  blogIdInBodyValidation,
  inputModelValidation,
];

export const postBlogIdValidation = () => [
  titleValidation,
  shortDescriptionValidation,
  contentValidatorValidation,
  inputModelValidation,
  blogIdInParamsValidation,
  notFoundValidation,
];