import { faker } from "@faker-js/faker";
import User from "../models/user.js";

const createUser = async (numUsers) => {
  try {
    const usersPromise = [];

    for (let i = 0; i < numUsers; i++) {
      const tempUser = User.create({
        name: faker.person.fullName(),
        username: faker.internet.username(),
        bio: faker.lorem.sentence(10),
        password: "password",
        avatar: {
          url: faker.image.avatar(),
          public_id: faker.system.fileName(),
        },
      });

      usersPromise.push(tempUser);
    }

    await Promise.all(usersPromise);
    console.log("user created", numUsers);
    process.exit(1);
  } catch (error) {
    console.log("error", error);
    process.exit(1);
  }
};



export { createUser };

