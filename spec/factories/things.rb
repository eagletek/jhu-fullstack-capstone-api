FactoryGirl.define do
  factory :thing do
    sequence(:name) { |n|
      case (n%5)
      when 0
        Faker::StarWars.planet
      when 1
        Faker::Educator.university
      when 2
        Faker::Zelda.location
      when 3
        Faker::Friends.location
      else
        Faker::HarryPotter.location
      end
    }

    sequence(:description) {|n| n%3==0 ? nil : Faker::Coffee.notes }
    sequence(:notes) {|n| n%2==0 ? nil : Faker::HarryPotter.quote }

    trait :with_description do
      description { Faker::Coffee.notes }
    end

    trait :with_notes do
      notes { Faker::HarryPotter.quote }
    end

    trait :with_fields do
      description { Faker::Lorem.paragraphs.join }
      notes       { Faker::Lorem.paragraphs.join }
    end

    trait :with_image do
      transient do
        image_count 1
      end
      after(:build) do |thing, props|
        thing.thing_images << build_list(:thing_image, props.image_count, :thing=>thing)
      end
    end
  end
end
