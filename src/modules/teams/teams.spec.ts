import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { TeamsController } from "./teams.controller";
import { TeamsService } from "./teams.service";
import { Team } from "src/generated/prisma/client/mongo";
import { FirebaseStorageService } from "src/common/services/firebase/firebase-storage.service";
import { FirebaseService } from "src/common/services/firebase/firebase.service";
import { ApiConfigService } from "src/common/services/api-config.service";
import { ConfigService } from "@nestjs/config";
import { IConfig } from "src/config/config.interface";
jest.mock("@nestjs/config");
jest.mock("src/common/services/mongo-prisma.service.ts");
jest.mock("src/common/services/api-config.service.ts");
jest.mock("src/common/services/firebase/firebase-storage.service.ts");
jest.mock("src/common/services/firebase/firebase.service.ts");

describe("TeamsController", () => {
  let teamsController: TeamsController;
  let teamsService: TeamsService;

  const NOW = new Date();

  beforeEach(async () => {
    const apiConfigService = new ApiConfigService(new ConfigService<IConfig, true>());
    const firebaseService = new FirebaseService(apiConfigService);
    const firebaseStorageService = new FirebaseStorageService(firebaseService);
    const mongoPrismaService = new MongoPrismaService();

    teamsService = new TeamsService(mongoPrismaService, firebaseStorageService);

    teamsController = new TeamsController(teamsService);
  });

  describe("getMany", () => {
    it("should return an array of teams", async () => {
      const mockTeams: Team[] = [
        { id: "123", imageUrl: "", createdAt: NOW, updatedAt: NOW, name: "Team 1", description: "Description 1" },
        { id: "321", imageUrl: "", createdAt: NOW, updatedAt: NOW, name: "Team 2", description: "Description 2" },
      ];

      jest.spyOn(teamsService, "getMany").mockResolvedValue(mockTeams);

      const result = await teamsController.getMany();

      expect(result).toBe(mockTeams);
    });
  });

  describe("getOne", () => {
    it("should return a team with the specified id", async () => {
      const mockTeam: Team = {
        id: "123",
        imageUrl: "",
        createdAt: NOW,
        updatedAt: NOW,
        name: "Team 1",
        description: "Description 1",
      };
      const id = "123";

      jest.spyOn(teamsService, "getOne").mockResolvedValue(mockTeam);

      const result = await teamsController.getOne(id);

      expect(result).toBe(mockTeam);
    });
  });

  describe("create", () => {
    it("should create a new team and return the team object", async () => {
      const createTeamDto = {
        id: "132",
        name: "New Team-3",
        description: "New Description-3",
      };
      const createdTeam: Team = {
        id: "132",
        name: "New Team-3",
        description: "New Description-3",
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(teamsService, "create").mockResolvedValue(createdTeam);

      const result = await teamsController.create(createTeamDto);

      expect(result).toBe(createdTeam);
    });
  });

  describe("update", () => {
    it("should update a team with the specified id and return the updated team object", async () => {
      const updateTeamDto = {
        id: "123",
        name: "Updated Team",
        description: "Updated Description",
      };
      const updatedTeam: Team = {
        name: "Updated Team",
        description: "Updated Description",
        id: "123",
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const paramId = "123";

      jest.spyOn(teamsService, "updateOne").mockResolvedValue(updatedTeam);

      const result = await teamsController.update(paramId, updateTeamDto);

      expect(result).toBe(updatedTeam);
    });
  });

  describe("delete", () => {
    it("should delete a team with the specified id", async () => {
      const id = "123";

      jest.spyOn(teamsService, "deleteOne").mockResolvedValue();

      await teamsController.delete(id);
    });
  });
});
