import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { TeamsController } from "./teams.controller";
import { TeamsService } from "./teams.service";
import { Team } from "src/generated/prisma/client/mongo";
import { FirebaseStorageService } from "src/common/services/firebase/firebase-storage.service";
import { FirebaseService } from "src/common/services/firebase/firebase.service";
import { ApiConfigService } from "src/common/services/api-config.service";
import { ConfigService } from "@nestjs/config";
import { IConfig } from "src/config/config.interface";
import { TeamItem } from "./models/team-item.model";
import { AuthPayload } from "../auth/models/auth-payload.model";
import { StadiumItem } from "../stadiums/models/stadium-item.model";
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
      const mockTeams = [
        {
          id: "123",
          imageUrl: "",
          createdAt: NOW,
          updatedAt: NOW,
          name: "Team 1",
          country: "PL",
          league: "PL",
          stadium: {
            id: "",
            imageUrl: null,
            websiteUrl: null,
            name: "",
            latitude: 0,
            longitude: 0,
            description: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            teamId: "",
          },
        },
        {
          id: "321",
          imageUrl: "",
          createdAt: NOW,
          updatedAt: NOW,
          name: "Team 2",
          country: "PL",
          league: "PL",
          stadium: {
            id: "",
            imageUrl: null,
            websiteUrl: null,
            name: "",
            latitude: 0,
            longitude: 0,
            description: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            teamId: "",
          },
        },
      ];

      jest.spyOn(teamsService, "getMany").mockResolvedValue({ data: mockTeams, count: mockTeams.length });
      const payload: AuthPayload = {
        uid: "",
        email: "",
        name: "",
        email_verified: false,
      };
      const result = await teamsController.getMany(payload);

      expect(result).toStrictEqual({ data: mockTeams, count: mockTeams.length });
    });
  });

  describe("getOne", () => {
    it("should return a team with the specified id", async () => {
      const mockTeam = {
        id: "123",
        imageUrl: "",
        createdAt: NOW,
        updatedAt: NOW,
        name: "Team 1",
        country: "PL",
        league: "PL",
        stadium: {
          id: "",
          imageUrl: null,
          websiteUrl: null,
          name: "",
          latitude: 0,
          longitude: 0,
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          teamId: "123",
        },
      };

      const id = "123";

      jest.spyOn(teamsService, "getOne").mockResolvedValue(mockTeam);

      const result = await teamsController.getOne(id);

      expect(result).toBe(mockTeam);
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
        country: "PL",
        league: "PL",
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
