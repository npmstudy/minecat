import { JsonObject, PackageJson } from "type-fest";

export interface MinecatPackageJson extends PackageJson {
  minecat: MinecatProjectConfig;
}

// TODO: should fill with Enum or strings @npmstudy
export type MinecatProjectType = string;

export interface MinecatProjectConfig extends JsonObject {
  type: MinecatProjectType;
}
