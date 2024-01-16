import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { Stadium, Team } from "src/generated/prisma/client/mongo";
import { StadiumsController } from "./stadiums.controller";
import { StadiumsService } from "./stadiums.service";
import { UpdateStadiumDto } from "./dto/update-stadium.dto";
import { FirebaseStorageService } from "src/common/services/firebase/firebase-storage.service";
import { FirebaseService } from "src/common/services/firebase/firebase.service";
import { ConfigService } from "@nestjs/config";
import { IConfig } from "src/config/config.interface";
import { ApiConfigService } from "src/common/services/api-config.service";
jest.mock("@nestjs/config");
jest.mock("src/common/services/mongo-prisma.service.ts");

describe("StadiumsController", () => {
  let stadiumsController: StadiumsController;
  let stadiumsService: StadiumsService;

  const NOW = new Date();

  beforeEach(async () => {
    const mongoPrismaService = new MongoPrismaService();
    const firebaseStorage = {} as FirebaseStorageService;
    stadiumsService = new StadiumsService(mongoPrismaService, firebaseStorage);
    stadiumsController = new StadiumsController(stadiumsService);
  });

  describe("getMany", () => {
    it("should return an array of stadiums", async () => {
      const mockTeams: Team[] = [
        { id: "123", imageUrl: "", createdAt: NOW, updatedAt: NOW, name: "Team 1", country: "PL", league: "PL" },
        { id: "321", imageUrl: "", createdAt: NOW, updatedAt: NOW, name: "Team 2", country: "PL", league: "PL" },
      ];

      const mockStadiums: Stadium[] = [
        {
          id: "1",
          name: "Stadium of Team1",
          latitude: 3,
          longitude: 4.4,
          description: "desc",
          createdAt: NOW,
          updatedAt: NOW,
          teamId: mockTeams[0].id,
          imageUrl: "http/image",
          websiteUrl: "http/image",
        },
        {
          id: "2",
          name: "Stadium of Team2",
          latitude: 3,
          longitude: 4.4,
          description: "desc",
          createdAt: NOW,
          updatedAt: NOW,
          teamId: mockTeams[1].id,
          imageUrl: "http/image",
          websiteUrl: "http/image",
        },
      ];

      jest.spyOn(stadiumsService, "getMany").mockResolvedValue({ data: mockStadiums, count: mockStadiums.length });

      const result = await stadiumsController.getMany();

      expect(result).toStrictEqual({ data: mockStadiums, count: mockStadiums.length });
    });
  });

  describe("getOne", () => {
    it("should return a stadium with the specified id", async () => {
      const mockTeam: Team = {
        id: "123",
        imageUrl: "",
        createdAt: NOW,
        updatedAt: NOW,
        name: "Team 1",
        country: "PL",
        league: "PL",
      };
      const mockStadium: Stadium = {
        id: "1",
        name: "Stadium of Team1",
        latitude: 3,
        longitude: 4.4,
        description: "desc",
        createdAt: NOW,
        updatedAt: NOW,
        teamId: mockTeam.id,
        imageUrl: null,
        websiteUrl: "http/website",
      };

      const paramIdStadium = "1";

      jest.spyOn(stadiumsService, "getOne").mockResolvedValue(mockStadium);

      const result = await stadiumsController.getOne(paramIdStadium);

      expect(result).toBe(mockStadium);
    });
  });

  describe("update", () => {
    it("should update a stadium with the specified id and return the updated stadium object", async () => {
      const id = "123";
      const updateStadiumDtoBody: UpdateStadiumDto = {
        name: "Updated stadium",
        latitude: 3333.3,
        longitude: 444.4,
        description: "desc updated",
      };

      const updatedStadium: Stadium = {
        name: "Updated Stadium",
        description: "Updated Description",
        id: "123",
        createdAt: NOW,
        updatedAt: NOW,
        teamId: "123",
        latitude: 3333.3,
        longitude: 444.4,
        imageUrl: null,
        websiteUrl: "http",
      };

      jest.spyOn(stadiumsService, "updateOne").mockResolvedValue(updatedStadium);

      const result = await stadiumsController.update(id, updateStadiumDtoBody);

      expect(result).toBe(updatedStadium);
    });
  });
});
