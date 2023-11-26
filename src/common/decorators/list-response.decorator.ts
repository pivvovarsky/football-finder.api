import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

export const ListResponse = (model: any) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        properties: {
          count: {
            type: "number",
          },
          data: {
            type: "array",
            items: { $ref: getSchemaPath(model) },
          },
        },
      },
    }),
  );
};
