import Address from "../../../../database/models/Address.js"
import Device from "../../../../database/models/Device.js"
import Restaurant from "../../../../database/models/Restaurant.js"
import User from "../../../../database/models/User.js"
import ErrorResponse from "../../../../middleware/globalErrorHandler.js"

export const FindUserByEmail = async email => {
  const user = await User.findOne({ email }).exec()
  if (!user) throw new ErrorResponse("User not find", 404)
  return user
}

export const FindAndDeleteDeviceByUserId = async id => {
  const device = await Device.findOneAndDelete({ user_id: id }).exec()
  if (!device) throw new ErrorResponse("Device not found", 404)
}

export const NewUser = async (userData, addressData) => {
  try {
    const address = new Address(addressData)
    await address.save()

    const user = new User({
      ...userData,
      role: "User",
      default_address: address._id,
      addresses: [address._id],
    })

    await user.validate()
    await user.save()

    const { password, ...rest } = user.toObject()
    return rest
  } catch (error) {
    console.error("Transaction failed:", error)
    throw new ErrorResponse(error.message || "Failed to create user", 500)
  }
}

export const NewChefAndRestaurant = async (chef_data, restaurant_data, address_data) => {
  try {
    const address = new Address(address_data)
    await address.save()

    const user = new User({
      ...chef_data,
      role: "Chef",
    })

    await user.validate()
    await user.save()

    const restaurant = new Restaurant(restaurant_data)

    restaurant.owner = user._id
    restaurant.address_id = address._id

    await restaurant.validate()
    await restaurant.save()

    const { password, ...rest } = user.toObject()
    return rest
  } catch (error) {
    console.error("Transaction failed:", error)
    throw new ErrorResponse(error.message || "Failed to create user", 500)
  }
}
