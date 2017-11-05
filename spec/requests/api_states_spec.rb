require 'rails_helper'

RSpec.describe "State API", type: :request do
  include_context "db_cleanup_each"

  context "caller requests list of States" do
    it_should_behave_like "resource index", :state do
      let(:response_check) do
        #pp payload
        expect(payload.count).to eq(resources.count);
        expect(payload.map{|f|f["name"]}).to eq(resources.map{|f|f[:name]})
      end
    end

  end

  context "a specific State exists" do
    it_should_behave_like "show resource", :state do
      let(:response_check) do
        #pp payload
        expect(payload).to have_key("id")
        expect(payload).to have_key("name")
        expect(payload["id"]).to eq(resource.id.to_s)
        expect(payload["name"]).to eq(resource.name)
      end
    end
  end

  context "create a new State" do
    it_should_behave_like "create resource", :state do
      let(:response_check) {
        #pp payload
        expect(payload).to have_key("name")
        expect(payload["name"]).to eq(resource_state[:name])

        # verify we can locate the created instance in DB
        expect(State.find(resource_id).name).to eq(resource_state[:name])
      }
    end
  end

  context "existing State" do
    it_should_behave_like "modifiable resource", :state do
      let(:update_check) {
        #verify name is not yet the new name
        expect(resource.name).to_not eq(new_state[:name])
        # verify DB has instance updated with name
        expect(State.find(resource.id).name).to eq(new_state[:name])
      }
    end
  end
end
